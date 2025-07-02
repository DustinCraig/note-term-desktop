import styled from "styled-components";
import {
  TREE_ITEM_HOVER,
  SIDEBAR_SELECTED_BG,
  SIDEBAR_SELECTED_TEXT,
  TEXT_COLOR,
  BUTTON_BORDER_COLOR,
} from "../../../Styles";
import { useNotes, Note } from "../../../context/NoteContext";
import { useFolders, Folder } from "../../../context/FolderContext";
import { useState } from "react";
import CreateNotePopup from "./CreateNotePopup";
import DeletePopup from "../../DeletePopup";
import Stack from "../../../components/Stack";

const NOTE_PADDING_LEFT = 1.0;

const TreeViewContainer = styled.div`
  flex: 1;
  padding-top: 1rem;
`;

const TreeItem = styled.div<{ $selected?: boolean; $isNote?: boolean }>`
  padding: 0.3rem 0 0.3rem 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  font-family: inherit;
  font-size: 1.1em;
  border-left: ${({ $isNote }) => ($isNote ? "1.5px dashed #0f0" : "none")};
  color: ${({ $selected }) => ($selected ? SIDEBAR_SELECTED_TEXT : "inherit")};
  background: ${({ $selected }) =>
    $selected ? SIDEBAR_SELECTED_BG : "transparent"};
  transition: background 0.15s, color 0.15s;

  &:hover {
    color: ${TREE_ITEM_HOVER};
    background: rgba(0, 255, 0, 0.07);
    text-decoration: underline;
  }
`;

const FolderItem = styled(TreeItem)`
  font-weight: bold;
  font-size: 1.13em;
  width: 100%;
`;

const NoteItem = styled(TreeItem)<{
  $paddingLeft?: number;
  $selected?: boolean;
}>`
  padding-left: ${({ $paddingLeft = 0 }) => $paddingLeft + 1}rem;
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

const FolderActionButton = styled.button`
  background: none;
  border: 1px dashed ${BUTTON_BORDER_COLOR};
  color: ${TEXT_COLOR};
  cursor: pointer;
  padding: 0.08em 0.25em;
  margin-left: 0.5em;
  font-size: 0.95em;
  border-radius: 3px;
  line-height: 1;
  box-shadow: 0 0 4px ${TEXT_COLOR};
  text-shadow: 0 0 3px ${TEXT_COLOR};
  opacity: 0;
  transition: opacity 0.2s, box-shadow 0.15s, color 0.15s, border-color 0.15s;
  vertical-align: middle;
  ${TreeItem}:hover & {
    opacity: 1;
  }
  &:hover,
  &:focus {
    background: ${TREE_ITEM_HOVER};
    box-shadow: 0 0 8px ${TEXT_COLOR};
    border-color: ${TEXT_COLOR};
    outline: none;
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

const StyledStack = styled(Stack)`
  width: 100%;
`;

export default () => {
  const { notes, addNote, setSelectedNote, selectedNote } = useNotes();
  const { folders, renameFolder, deleteFolder } = useFolders();
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>(
    undefined
  );
  const [editingName, setEditingName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(
    new Set()
  );
  const [isCreateNotePopupOpen, setIsCreateNotePopupOpen] = useState(false);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);

  const onNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  const onNoteCreateWithFolder = (folderid: number) => {
    setSelectedFolderId(folderid);
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

  const toggleFolder = (folderid: number) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderid)) {
        next.delete(folderid);
      } else {
        next.add(folderid);
      }
      return next;
    });
  };

  const onFolderDelete = (folder: Folder) => {
    setDeletingFolder(folder);
  };

  const onFolderDeleteCancel = () => {
    setDeletingFolder(null);
  };

  const onFolderDeleteConfirm = () => {
    if (deletingFolder) {
      deleteFolder(deletingFolder);
    }
    setDeletingFolder(null);
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
    <TreeViewContainer>
      <DeletePopup
        contentType="folder"
        onClose={onFolderDeleteCancel}
        onConfirmDelete={onFolderDeleteConfirm}
        isOpen={Boolean(deletingFolder)}
      />
      {/* Root notes */}
      {notes
        .filter((note) => !note.folderid)
        .map((note) => (
          <NoteItem
            key={note.id}
            onClick={() => onNoteClick(note)}
            $isNote
            $selected={selectedNote?.id === note.id}
          >
            <span
              style={{
                width: "1.2em",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              -
            </span>
            {note.title}
          </NoteItem>
        ))}

      {/* Folders */}
      {folders.map((folder) => (
        <div key={folder.id}>
          <FolderItem onClick={() => toggleFolder(folder.id)}>
            <Chevron $isExpanded={expandedFolders.has(folder.id)}>
              {expandedFolders.has(folder.id) ? "v" : ">"}
            </Chevron>
            <span
              style={{
                width: "1.2em",
                display: "inline-block",
                textAlign: "center",
              }}
            ></span>
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
                <StyledStack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div>{folder.name}</div>
                  <StyledStack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <FolderActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(folder);
                      }}
                    >
                      ✎
                    </FolderActionButton>
                    <FolderActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingFolder(folder);
                      }}
                    >
                      X
                    </FolderActionButton>
                  </StyledStack>
                </StyledStack>
              </>
            )}
          </FolderItem>
          <FolderContent $isExpanded={expandedFolders.has(folder.id)}>
            {notes
              .filter((note) => note.folderid === folder.id)
              .map((note) => (
                <NoteItem
                  key={note.id}
                  onClick={() => onNoteClick(note)}
                  $paddingLeft={NOTE_PADDING_LEFT}
                  $isNote
                  $selected={selectedNote?.id === note.id}
                >
                  <span
                    style={{
                      width: "1.2em",
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    -
                  </span>
                  {note.title}
                </NoteItem>
              ))}
            <NoteItem
              onClick={() => onNoteCreateWithFolder(folder.id)}
              $paddingLeft={NOTE_PADDING_LEFT}
              $isNote
              style={{ opacity: 0.7 }}
            >
              <span
                style={{
                  width: "1.2em",
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                +
              </span>{" "}
              Note
            </NoteItem>
          </FolderContent>
        </div>
      ))}
      <CreateNotePopup
        isOpen={isCreateNotePopupOpen}
        onClose={onCreateNoteClose}
        onSubmit={onCreateNoteSubmit}
      />
    </TreeViewContainer>
  );
};
