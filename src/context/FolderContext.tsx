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
  id: string;
  name: string;
};

export type FolderContextType = {
  folders: Folder[];
  addFolder: (folderName: string) => boolean;
  deleteFolder: (folder: Folder) => boolean;
  renameFolder: (folder: Folder, newName: string) => boolean;
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

  const addFolder = (folderName: string) => {
    if (!folderName) {
      throw new Error("Got empty folder name");
    }
    const folder: Folder = {
      id: uuidv4(),
      name: folderName,
    };
    setFolders([...folders, folder]);
    return true;
  };

  const deleteFolder = (folder: Folder) => {
    setFolders(folders.filter((f) => f.id !== folder.id));
    return true;
  };

  const renameFolder = (folder: Folder, newName: string) => {
    if (!newName) {
      throw new Error("Got empty folder name");
    }
    setFolders(
      folders.map((f) => (f.id === folder.id ? { ...f, name: newName } : f))
    );
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
