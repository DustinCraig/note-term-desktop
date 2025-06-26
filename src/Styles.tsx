import { createGlobalStyle } from "styled-components";

export const TEXT_COLOR = "#00ff00";
export const DIVIDER_COLOR = "#003300";
export const BACKGROUND_COLOR = "#000000";
export const BUTTON_BORDER_COLOR = "#004400";
export const BUTTON_HOVER_BACKGROUND_COLOR = "#002200";
export const TREE_ITEM_HOVER = "#00aa00";
export const EDITOR_HEADER_BORDER_COLOR = "#003300";
export const SELECTION_COLOR = "rgba(0, 255, 0, 0.3)";
export const SIDEBAR_TITLE_COLOR = TEXT_COLOR;
export const SIDEBAR_TITLE_GLOW_COLOR = "#00ff99";
export const SIDEBAR_SELECTED_BG = "rgba(0,255,0,0.25)";
export const SIDEBAR_SELECTED_TEXT = TEXT_COLOR;

export const GlobalStyles = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'VT323', 'Courier Prime', 'IBM Plex Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace;
}

body,html {
    font-size: 22px;
    line-height: 1.5;
    letter-spacing: 0.5px;
    background-color: ${BACKGROUND_COLOR};
    color: ${TEXT_COLOR};
    height: 100%;
    overflow: hidden;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: none;
    text-shadow: 0 0 2px ${TEXT_COLOR};
    padding: 0.5rem;
}

#app {
    height: 100vh;
    width: 100vw;
}

input, textarea {
    caret-color: ${TEXT_COLOR};
}

::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: ${BACKGROUND_COLOR};
}

::-webkit-scrollbar-thumb {
    background: ${DIVIDER_COLOR};
    border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
    background: ${BUTTON_BORDER_COLOR};
}
`;
