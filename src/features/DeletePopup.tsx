import Popup from "../components/Popup";
import Button from "../components/Button";
import Stack from "../components/Stack";
import styled from "styled-components";
import type { Note } from "../context/NoteContext";
import type { Folder } from "../context/FolderContext";

const NoWrap = styled.span`
  white-space: nowrap;
`;

const QuestionText = styled.p`
  margin: 0 0 1.5rem 0;
  white-space: normal;
  word-break: break-word;
`;

type DeletePopupProps = {
  isOpen: boolean;
  contentType: "note" | "folder";
  onClose: () => void;
  onConfirmDelete: () => void;
};

export default ({
  isOpen,
  onClose,
  onConfirmDelete,
  contentType,
}: DeletePopupProps) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <Stack alignItems="center">
        <QuestionText>
          <NoWrap>Are you sure you want to delete this {contentType}?</NoWrap>
        </QuestionText>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Button onClick={onConfirmDelete}>Yes</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Stack>
      </Stack>
    </Popup>
  );
};
