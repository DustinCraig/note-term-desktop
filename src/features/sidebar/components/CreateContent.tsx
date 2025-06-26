import { useState, useRef, useEffect } from "react";
import {
  BUTTON_BORDER_COLOR,
  BUTTON_HOVER_BACKGROUND_COLOR,
  TEXT_COLOR,
  BACKGROUND_COLOR,
} from "../../../Styles";
import styled from "styled-components";
import Button from "../../../components/Button";
import Stack from "../../../components/Stack";
import CreateNotePopup from "./CreateNotePopup";
import { useFolders } from "../../../context/FolderContext";
import { useNotes } from "../../../context/NoteContext";
import CreateFolderPopup from "./CreateFolderPopup";

const DropdownMenu = styled.div`
  position: absolute;
  left: 0;
  top: 2.2rem;
  border: 1.5px solid ${BUTTON_BORDER_COLOR};
  border-radius: 4px;
  z-index: 100;
  min-width: 220px;
  padding: 0.2em 0;
  background: ${BACKGROUND_COLOR};
`;

const DropdownItem = styled.div`
  color: ${TEXT_COLOR};
  padding: 0.5em 1em;
  font-family: inherit;
  font-size: 1em;
  cursor: pointer;
  &:hover {
    background: ${BUTTON_HOVER_BACKGROUND_COLOR};
  }
`;

const CreateContentWrapper = styled.div`
  position: relative;
`;

export default () => {
  const { addFolder } = useFolders();
  const { addNote } = useNotes();
  const [isCreateNotePopupOpen, setIsCreateNotePopupOpen] = useState(false);
  const [isCreateFolderPopupOpen, setIsCreateFolderPopupOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  const onCreateFolderClick = () => {
    setIsCreateFolderPopupOpen(true);
    setDropdownOpen(false);
  };

  const onCreateNoteClick = () => {
    setIsCreateNotePopupOpen(true);
    setDropdownOpen(false);
  };

  const onCreateNoteClose = () => {
    setIsCreateNotePopupOpen(false);
  };

  const onCreateFolderClose = () => {
    setIsCreateFolderPopupOpen(false);
  };

  const onCreateFolderSubmit = (folderName: string) => {
    addFolder(folderName);
    setIsCreateFolderPopupOpen(false);
  };

  const onCreateNoteSubmit = (noteName: string) => {
    addNote(noteName);
    setIsCreateNotePopupOpen(false);
  };

  const onCreateClick = () => {
    setDropdownOpen(true);
  };

  useEffect(() => {
    if (!dropdownOpen) {
      document.removeEventListener("mousedown", onClick);
      return;
    }
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("mousedown", onClick);
    };
  }, [dropdownOpen]);

  return (
    <CreateContentWrapper>
      <Button onClick={onCreateClick} title="Add new">
        + Create
      </Button>
      {dropdownOpen && (
        <DropdownMenu ref={dropdownRef}>
          <DropdownItem onClick={onCreateNoteClick}>New Note</DropdownItem>
          <DropdownItem onClick={onCreateFolderClick}>New Folder</DropdownItem>
        </DropdownMenu>
      )}
      <CreateNotePopup
        isOpen={isCreateNotePopupOpen}
        onClose={onCreateNoteClose}
        onSubmit={onCreateNoteSubmit}
      />
      <CreateFolderPopup
        isOpen={isCreateFolderPopupOpen}
        onClose={onCreateFolderClose}
        onSubmit={onCreateFolderSubmit}
      />
    </CreateContentWrapper>
  );
};
