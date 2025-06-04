import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
}

export type NoteContextType = {
  notes: Note[];
  selectedNote?: Note;
  setSelectedNote: (note?: Note) => void;
  updateNote: (note: Note) => void;
  addNote: (title: string, folderId?: string) => boolean;
  deleteNote: (note: Note) => boolean;
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;
};

export const NoteContext = createContext<NoteContextType | null>(null);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [isPreview, setIsPreview] = useState(false);

  const addNote = (title: string, folderId?: string) => {
    const note: Note = {
      title,
      content: "New note!",
      folderId,
      id: uuidv4(),
    };
    setNotes([...notes, note]);
    setSelectedNote(note);
    setIsPreview(false);
    return true;
  };

  const deleteNote = (note: Note) => {
    setNotes(notes.filter((n) => n.id !== note.id));
    if (note.id === selectedNote?.id) {
      setSelectedNote(undefined);
    }
    return true;
  };

  const updateNote = (note: Note) => {
    setNotes(notes.map((n) => (n.id === note.id ? note : n)));
  };

  const _setSelectedNote = (note?: Note) => {
    if (note?.id !== selectedNote?.id) {
      setSelectedNote(note);
    }
  };

  const value = {
    notes,
    selectedNote,
    setSelectedNote: _setSelectedNote,
    addNote,
    updateNote,
    deleteNote,
    isPreview: isPreview,
    setIsPreview,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

export const useNotes = () => {
  const notesContext = useContext(NoteContext);
  if (!notesContext) {
    throw new Error("useNotes must be used within a NoteProvider");
  }
  return notesContext;
};
