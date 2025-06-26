import {
  DIVIDER_COLOR,
  BACKGROUND_COLOR,
  SIDEBAR_TITLE_COLOR,
  SIDEBAR_TITLE_GLOW_COLOR,
} from "../../Styles";
import TreeView from "./components/TreeView";
import styled from "styled-components";
import Stack from "../../components/Stack";
import CreateContent from "./components/CreateContent";

const Sidebar = styled.div`
  width: 15%;
  background-color: ${BACKGROUND_COLOR};
  border-right: 1px solid ${DIVIDER_COLOR};
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  margin-bottom: 0.1rem;
  padding-bottom: 0.2rem;
  border-bottomr: 1px solid ${DIVIDER_COLOR};
`;

const SidebarTitle = styled.h1`
  font-size: 1.5rem;
  color: ${SIDEBAR_TITLE_COLOR};
  font-weight: bold;
  letter-spacing: 0.08em;
  text-align: center;
  margin-bottom: 0.7rem;
  text-shadow: 0 0 8px ${SIDEBAR_TITLE_GLOW_COLOR},
    0 0 16px ${SIDEBAR_TITLE_GLOW_COLOR}, 0 0 2px #fff;
  user-select: none;
  border-bottom: 2px solid ${SIDEBAR_TITLE_COLOR};
  padding-bottom: 0.2em;
`;

const SidebarTitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

export default () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarTitleRow>
          <SidebarTitle>note-term</SidebarTitle>
        </SidebarTitleRow>
      </SidebarHeader>
      <Stack direction="column" spacing={0.1}>
        <Stack direction="row" justifyContent="center">
          <CreateContent />
        </Stack>
        <TreeView />
      </Stack>
    </Sidebar>
  );
};
