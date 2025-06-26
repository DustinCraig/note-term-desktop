import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { api } from "../services/api";

export type Folder = {
  id: number;
  name: string;
};

export type FolderContextType = {
  folders: Folder[];
  addFolder: (folderName: string) => Promise<boolean>;
  deleteFolder: (folder: Folder) => boolean;
  renameFolder: (folder: Folder, newName: string) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
};

export const FolderContext = createContext<FolderContextType | null>(null);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const ignoreAPIResult = useRef(false);

  const fetchFolders = useCallback(async () => {
    if (ignoreAPIResult.current) {
      return;
    }
    setIsLoading(true);
    try {
      const folders = await api.fetchFolders();
      console.log(`setting folders to ${folders}`);
      setFolders(folders);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Unknown error while fetching folders")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    ignoreAPIResult.current = false;
    fetchFolders();
    return () => {
      ignoreAPIResult.current = true;
    };
  }, [fetchFolders]);

  const addFolder = async (folderName: string) => {
    if (!folderName) {
      throw new Error("Got empty folder name");
    }
    const folder: Folder = {
      id: -1,
      name: folderName,
    };

    try {
      const result = await api.createFolder(folder);
      if (!result.success) {
        throw new Error(
          result.message ?? "Unknown error while creating folder"
        );
      }
      setFolders([...folders, folder]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Unknown error while creating folder")
      );
      return false;
    }
    return true;
  };

  const deleteFolder = (folder: Folder) => {
    setFolders(folders.filter((f) => f.id !== folder.id));
    return true;
  };

  const renameFolder = async (folder: Folder, newName: string) => {
    if (!newName) {
      throw new Error("Got empty folder name");
    }

    const newFolder = {
      ...folder,
      name: newName,
    } as Folder;

    try {
      const result = await api.updateFolder(newFolder);
      if (!result.success) {
        throw new Error(
          result.message ??
            `Unknown error while trying to update folder with id: ${folder.id}`
        );
      }
      setFolders(
        folders.map((f) => (f.id === folder.id ? { ...f, name: newName } : f))
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(
              `Unknown error while trying to update folder name with id: ${folder.id}`
            )
      );
      return false;
    }

    return true;
  };

  const value = {
    folders,
    addFolder,
    deleteFolder,
    renameFolder,
    error,
    isLoading,
  };

  return (
    <FolderContext.Provider value={value}>{children}</FolderContext.Provider>
  );
};

export const useFolders = () => {
  const foldersContext = useContext(FolderContext);
  if (!foldersContext) {
    throw new Error("useFolders must be used within a FolderProvider");
  }
  return foldersContext;
};
