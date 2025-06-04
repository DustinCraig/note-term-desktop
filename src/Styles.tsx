import { createGlobalStyle } from "styled-components";

export const TEXT_COLOR = "#fff";
export const DIVIDER_COLOR = "#333";
export const BACKGROUND_COLOR = "#000";
export const BUTTON_BORDER_COLOR = "#444";
export const BUTTON_HOVER_BACKGROUND_COLOR = "#222";
export const TREE_ITEM_HOVER = "#ccc";
export const EDITOR_HEADER_BORDER_COLOR = "#333";
export const SELECTION_COLOR = "rgba(255, 255, 255, 0.2)";

export const GlobalStyles = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body,html {
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.4;
    letter-spacing: 0.3px;
    background-color: ${BACKGROUND_COLOR};
    color: ${TEXT_COLOR};
    height: 100%;
    overflow: hidden;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: none;
}

#app {
    height: 100vh;
    width: 100vw;
}
`;
