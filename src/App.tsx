import React from "react";
import styled from "styled-components";
import { NoteProvider } from "./context/NoteContext";
import { FolderProvider } from "./context/FolderContext";
import { GlobalStyles } from "./Styles";
import Sidebar from "./features/sidebar";
import Editor from "./features/editor";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <FolderProvider>
        <NoteProvider>
          <AppContainer>
            <Sidebar />
            <Editor />
          </AppContainer>
        </NoteProvider>
      </FolderProvider>
    </>
  );
};

export default App;
