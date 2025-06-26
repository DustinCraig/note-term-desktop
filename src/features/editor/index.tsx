import { useState, ChangeEvent, useEffect, useMemo } from "react";
import {
  EDITOR_HEADER_BORDER_COLOR,
  TEXT_COLOR,
  DIVIDER_COLOR,
  SELECTION_COLOR,
  BUTTON_HOVER_BACKGROUND_COLOR,
  BACKGROUND_COLOR,
  BUTTON_BORDER_COLOR,
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
  padding: 1rem 2rem;
  border-bottom: 2px solid ${EDITOR_HEADER_BORDER_COLOR};
  display: flex;
  justify-content: space-between;
  font-size: 1.3em;
  font-weight: bold;
`;

const EditorTitle = styled.input`
  background: none;
  border: none;
  color: ${TEXT_COLOR};
  width: 100%;
  outline: none;
  font-size: 1.2em;
  font-weight: bold;
  font-family: inherit;
  padding: 0.5rem 0;
  &:focus {
    border-bottom: 2px solid ${DIVIDER_COLOR};
  }
`;

const EditorActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TopBarButton = styled(Button)`
  margin-left: 0.3em;
  margin-right: 0.3em;
  padding: 0.18em 0.7em;
  font-size: 0.95em;
  border-radius: 5px;
`;

const Editor = styled.textarea`
  flex: 1;
  width: 100%;
  height: 100%;
  background: ${BACKGROUND_COLOR};
  color: ${TEXT_COLOR};
  line-height: 1.6;
  border: 2px solid ${DIVIDER_COLOR};
  padding: 2rem;
  resize: none;
  outline: none;
  font-size: 1.3em;
  font-family: inherit;
  white-space: pre-wrap;
  word-break: break-word;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &::selection {
    background-color: ${SELECTION_COLOR};
  }
  &:focus {
    border-color: ${TEXT_COLOR};
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
  }
`;

const PreviewContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: ${BACKGROUND_COLOR};
  color: ${TEXT_COLOR};
  font-size: 1.3em;
  font-family: inherit;
  line-height: 1.6;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: bold;
    font-size: inherit;
    font-family: inherit;
  }

  p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
    font-size: inherit;
    font-family: inherit;
  }

  code {
    background-color: ${BUTTON_HOVER_BACKGROUND_COLOR};
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: inherit;
    font-family: inherit;
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
              <TopBarButton onClick={onTogglePreview}>
                {isPreview ? "Edit" : "Preview"}
              </TopBarButton>
              <TopBarButton onClick={onDelete}>Delete</TopBarButton>
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
