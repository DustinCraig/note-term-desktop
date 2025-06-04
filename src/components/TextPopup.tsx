import Popup from "./Popup";
import Input from "./Input";
import Stack from "./Stack";
import styled from "styled-components";
import { TEXT_COLOR } from "../Styles";

const PopupText = styled.p`
  margin: 0 0 1rem 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: ${TEXT_COLOR};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

type TextPopupProps = {
  isOpen: boolean;
  prompt: string;
  title: string;
  onEnter: (text: string) => void;
  onClose: () => void;
  autoFocus?: boolean;
};

export default ({
  isOpen,
  prompt,
  title,
  onEnter,
  onClose,
  autoFocus = true,
}: TextPopupProps) => {
  const onSubmit = (text: string) => {
    onEnter(text);
    onClose();
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <Stack alignItems="center" direction="column">
        <PopupText>{title}</PopupText>
        <Input
          prompt={prompt}
          onSubmit={onSubmit}
          placeholder=""
          autoFocus={autoFocus}
        />
      </Stack>
    </Popup>
  );
};
