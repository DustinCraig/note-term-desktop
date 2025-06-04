import { DIVIDER_COLOR, BACKGROUND_COLOR, TEXT_COLOR } from "../../Styles";
import { useFolders } from "../../context/FolderContext";
import { useNotes } from "../../context/NoteContext";
import Button from "../../components/Button";
import TreeView from "./components/TreeView";
import styled from "styled-components";
import { useState } from "react";
import CreateNotePopup from "./components/CreateNotePopup";
import CreateFolderPopup from "./components/CreateFolderPopup";

const Sidebar = styled.div`
  width: 15%;
  background-color: ${BACKGROUND_COLOR};
  border-right: 1px solid ${DIVIDER_COLOR};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottomr: 1px solid ${DIVIDER_COLOR};
`;

const SidebarTitle = styled.h1`
  font-size: 1.2rem;
  color: ${TEXT_COLOR};
  margin-bottom: 0.5rem;
`;

export default () => {
  const { addFolder } = useFolders();
  const { addNote } = useNotes();
  const [isCreateNotePopupOpen, setIsCreateNotePopupOpen] = useState(false);
  const [isCreateFolderPopupOpen, setIsCreateFolderPopupOpen] = useState(false);

  const onCreateFolderClick = () => {
    setIsCreateFolderPopupOpen(true);
  };

  const onCreateFolderSubmit = (folderName: string) => {
    addFolder(folderName);
    setIsCreateFolderPopupOpen(false);
  };

  const onCreateFolderClose = () => {
    setIsCreateFolderPopupOpen(false);
  };

  const onCreateNoteClick = () => {
    setIsCreateNotePopupOpen(true);
  };

  const onCreateNoteSubmit = (noteName: string) => {
    addNote(noteName);
    setIsCreateNotePopupOpen(false);
  };

  const onCreateNoteClose = () => {
    setIsCreateNotePopupOpen(false);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarTitle>note-term</SidebarTitle>
        <div>
          <Button onClick={onCreateFolderClick}>+ Folder</Button>
          <Button onClick={onCreateNoteClick}>+ Note</Button>
        </div>
      </SidebarHeader>
      <TreeView />
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
    </Sidebar>
  );
};
