import styled from "styled-components";
import { TREE_ITEM_HOVER } from "../../../Styles";
import { useNotes, Note } from "../../../context/NoteContext";
import { useFolders, Folder } from "../../../context/FolderContext";
import { useState } from "react";
import CreateNotePopup from "./CreateNotePopup";

const NOTE_PADDING_LEFT = 1.0;

const TreeView = styled.div`
  flex: 1;
`;

const TreeItem = styled.div`
  padding: 0.3rem 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${TREE_ITEM_HOVER};
  }
`;

const FolderItem = styled(TreeItem)`
  font-weight: bold;
`;

const NoteItem = styled(TreeItem)<{ $paddingLeft?: number }>`
  padding-left: ${({ $paddingLeft = 0 }) => $paddingLeft}rem;
`;

const FolderNameInput = styled.input`
  background: transparent;
  border: 1px solid ${TREE_ITEM_HOVER};
  color: inherit;
  font-weight: bold;
  padding: 0.2rem;
  border-radius: 3px;
  font-size: inherit;
  width: 100%;
  max-width: 200px;

  &:focus {
    outline: none;
    border-color: ${TREE_ITEM_HOVER};
  }
`;

const RenameButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.2rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${TreeItem}:hover & {
    opacity: 1;
  }

  &:hover {
    color: ${TREE_ITEM_HOVER};
  }
`;

const Chevron = styled.span<{ $isExpanded: boolean }>`
  display: inline-block;
  transition: transform 0.2s;
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? "90deg" : "0deg")});
  width: 1rem;
  text-align: center;
`;

const FolderContent = styled.div<{ $isExpanded: boolean }>`
  display: ${({ $isExpanded }) => ($isExpanded ? "block" : "none")};
`;

export default () => {
  const { notes, addNote, setSelectedNote } = useNotes();
  const { folders, renameFolder } = useFolders();
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined
  );
  const [editingName, setEditingName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [isCreateNotePopupOpen, setIsCreateNotePopupOpen] = useState(false);

  const onNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  const onNoteCreateWithFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    setIsCreateNotePopupOpen(true);
  };

  const startEditing = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditingName(folder.name);
  };

  const handleRename = (folder: Folder) => {
    if (editingName.trim()) {
      renameFolder(folder, editingName.trim());
    }
    setEditingFolderId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, folder: Folder) => {
    if (e.key === "Enter") {
      handleRename(folder);
    } else if (e.key === "Escape") {
      setEditingFolderId(null);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const onCreateNoteClose = () => {
    setIsCreateNotePopupOpen(false);
    setSelectedFolderId(undefined);
  };

  const onCreateNoteSubmit = (noteName: string) => {
    addNote(noteName, selectedFolderId);
    setSelectedFolderId(undefined);
  };

  return (
    <TreeView>
      {/* Root notes */}
      {notes
        .filter((note) => !note.folderId)
        .map((note) => (
          <NoteItem key={note.id} onClick={() => onNoteClick(note)}>
            {note.title}
          </NoteItem>
        ))}

      {/* Folders */}
      {folders.map((folder) => (
        <div key={folder.id}>
          <FolderItem onClick={() => toggleFolder(folder.id)}>
            <Chevron $isExpanded={expandedFolders.has(folder.id)}>›</Chevron>
            {editingFolderId === folder.id ? (
              <FolderNameInput
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleRename(folder)}
                onKeyDown={(e) => handleKeyPress(e, folder)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                {folder.name}
                <RenameButton
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(folder);
                  }}
                >
                  ✎
                </RenameButton>
              </>
            )}
          </FolderItem>
          <FolderContent $isExpanded={expandedFolders.has(folder.id)}>
            {notes
              .filter((note) => note.folderId === folder.id)
              .map((note) => (
                <NoteItem
                  key={note.id}
                  onClick={() => onNoteClick(note)}
                  $paddingLeft={NOTE_PADDING_LEFT}
                >
                  {note.title}
                </NoteItem>
              ))}
            <NoteItem
              onClick={() => onNoteCreateWithFolder(folder.id)}
              $paddingLeft={NOTE_PADDING_LEFT}
            >
              + Note
            </NoteItem>
          </FolderContent>
        </div>
      ))}
      <CreateNotePopup
        isOpen={isCreateNotePopupOpen}
        onClose={onCreateNoteClose}
        onSubmit={onCreateNoteSubmit}
      />
    </TreeView>
  );
};
