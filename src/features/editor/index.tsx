import { useState, ChangeEvent, useEffect, useMemo } from "react";
import {
  EDITOR_HEADER_BORDER_COLOR,
  TEXT_COLOR,
  DIVIDER_COLOR,
  SELECTION_COLOR,
  BUTTON_HOVER_BACKGROUND_COLOR,
} from "../../Styles";
import { useNotes, Note } from "../../context/NoteContext";
import styled from "styled-components";
import Button from "../../components/Button";
import DeletePopup from "../DeletePopup";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const EditorHeader = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${EDITOR_HEADER_BORDER_COLOR};
  display: flex;
  justify-content: space-between;
`;

const EditorTitle = styled.input`
  background: none;
  border: none;
  color: ${TEXT_COLOR};
  width: 100%;
  outline: none;
  &:focus {
    border-bottom: 1px solid ${DIVIDER_COLOR};
  }
`;

const EditorActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Editor = styled.textarea`
  flex: 1;
  width: 100%;
  height: 100%;
  background: #000;
  color: ${TEXT_COLOR};
  font-family: 'Courier New', monospace;
  line-height: 1.5;
  border: none;
  padding: 1rem;
  resize: none;e
  outline: none;

  letter-spacing: 0.05em;
  white-space: pre-wrap;
  word-break: break-word;
  &::selection {
    background-color: ${SELECTION_COLOR};
  }
`;

const PreviewContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #000;
  color: ${TEXT_COLOR}

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  p { 
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  code {
    background-color: ${BUTTON_HOVER_BACKGROUND_COLOR}
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
  }
`;

type EditorPreviewProps = {
  isExampleContainer: boolean;
  selectedNote?: Note;
};

export const EditorPreview = ({
  isExampleContainer,
  selectedNote,
}: EditorPreviewProps) => {
  if (isExampleContainer) {
    return (
      <PreviewContainer>
        <h2>Welcome to note-term!</h2>
        <br />
        <p>
          Select an existing note or create a note from the sidebar to get
          started.
        </p>
      </PreviewContainer>
    );
  }
  return (
    <PreviewContainer>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {selectedNote?.content || ""}
      </ReactMarkdown>
    </PreviewContainer>
  );
};

export default () => {
  const { selectedNote, updateNote, isPreview, setIsPreview, deleteNote } =
    useNotes();
  const [localNote, setLocalNote] = useState<Note | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setLocalNote(selectedNote);
  }, [selectedNote]);

  const onTogglePreview = () => {
    setIsPreview(!isPreview);
  };

  const onDelete = () => {
    setIsDeleting(true);
  };

  const onDeleteCancel = () => {
    setIsDeleting(false);
  };

  const onDeleteConfirm = () => {
    setIsDeleting(false);
    if (selectedNote) {
      deleteNote(selectedNote);
    }
  };

  const onSave = () => {
    if (localNote) {
      updateNote(localNote);
      setIsPreview(true);
    }
  };

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!localNote) {
      return;
    }
    const newNote = { ...localNote, content: e.target.value };
    setLocalNote(newNote);
  };

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!localNote) {
      return;
    }
    const newNote = { ...localNote, title: e.target.value };
    setLocalNote(newNote);
  };

  const previewContent = useMemo(() => {
    if (!localNote?.content) {
      return null;
    }
    return (
      <PreviewContainer>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {localNote.content}
        </ReactMarkdown>
      </PreviewContainer>
    );
  }, [localNote?.content]);

  return (
    <EditorContainer>
      <DeletePopup
        isOpen={isDeleting}
        onClose={onDeleteCancel}
        onConfirmDelete={onDeleteConfirm}
      />
      {localNote ? (
        <>
          <EditorHeader>
            <EditorTitle value={localNote.title} onChange={onTitleChange} />
            <EditorActionsContainer>
              {!isPreview && <Button onClick={onSave}>Save</Button>}
              <Button onClick={onTogglePreview}>
                {isPreview ? "Edit" : "Preview"}
              </Button>
              <Button onClick={onDelete}>Delete</Button>
            </EditorActionsContainer>
          </EditorHeader>

          {isPreview ? (
            previewContent
          ) : (
            <Editor
              autoFocus={true}
              value={localNote.content}
              placeholder="Start typing..."
              onChange={onTextChange}
            />
          )}
        </>
      ) : (
        <EditorPreview isExampleContainer={true} />
      )}
    </EditorContainer>
  );
};
