import styled from "styled-components";
import {
  TEXT_COLOR,
  BUTTON_BORDER_COLOR,
  BUTTON_HOVER_BACKGROUND_COLOR,
} from "../Styles";

export default styled.button`
  background: none;
  border: 1.5px solid ${BUTTON_BORDER_COLOR};
  color: ${TEXT_COLOR};
  padding: 0.3rem 0.5rem;
  margin-right: 0.7rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  font-family: inherit;
  font-weight: bold;
  font-size: 1em;
  box-shadow: 0 0 6px 0 ${BUTTON_BORDER_COLOR};
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;

  &:hover,
  &:focus {
    background-color: ${BUTTON_HOVER_BACKGROUND_COLOR};
    box-shadow: 0 0 16px 2px ${TEXT_COLOR};
    outline: none;
    transform: scale(1.05);
  }
`;
