import TextPopup from "../../../components/TextPopup";

type CreateNotePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (noteName: string) => void;
};

export default ({ isOpen, onClose, onSubmit }: CreateNotePopupProps) => {
  return (
    <TextPopup
      isOpen={isOpen}
      onClose={onClose}
      onEnter={onSubmit}
      prompt=""
      title="Enter note name:"
      autoFocus={true}
    />
  );
};
