import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { api } from "../services/api";

export interface Note {
  id: number;
  title: string;
  content: string;
  folderId?: string;
}

export type NoteContextType = {
  notes: Note[];
  selectedNote?: Note;
  setSelectedNote: (note?: Note) => void;
  updateNote: (note: Note) => void;
  addNote: (title: string, folderId?: string) => Promise<boolean>;
  deleteNote: (note: Note) => boolean;
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;
  isLoading: boolean;
  error: Error | null;
};

export const NoteContext = createContext<NoteContextType | null>(null);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const ignoreAPIResult = useRef(false);

  const fetchNotes = useCallback(async () => {
    if (ignoreAPIResult.current) {
      return;
    }
    setIsLoading(true);
    try {
      const notes = await api.fetchNotes();
      console.log("setting notes to", notes);
      setNotes(notes);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Unknown error while fetching notes")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    ignoreAPIResult.current = false;
    fetchNotes();
    return () => {
      ignoreAPIResult.current = true;
    };
  }, [fetchNotes]);

  const addNote = async (title: string, folderId?: string) => {
    const note: Note = {
      title,
      content: "New note!",
      folderId,
      id: -1,
    };
    try {
      await api.createNote(note);
      setNotes([...notes, note]);
      setSelectedNote(note);
      setIsPreview(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Unknown error while fetching notes")
      );
      return false;
    }
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
      setIsPreview(true);
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
    isLoading,
    error,
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
