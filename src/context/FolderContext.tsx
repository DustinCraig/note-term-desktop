import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type Folder = {
  id: string;
  name: string;
};

export type FolderContextType = {
  folders: Folder[];
  addFolder: (folderName: string) => boolean;
  deleteFolder: (folder: Folder) => boolean;
  renameFolder: (folder: Folder, newName: string) => boolean;
};

export const FolderContext = createContext<FolderContextType | null>(null);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);

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
