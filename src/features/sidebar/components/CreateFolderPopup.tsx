import TextPopup from "../../../components/TextPopup";

type CreateFolderPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (folderName: string) => void;
};

export default ({ isOpen, onClose, onSubmit }: CreateFolderPopupProps) => {
  return (
    <TextPopup
      isOpen={isOpen}
      onClose={onClose}
      onEnter={onSubmit}
      prompt=""
      title="Enter folder name:"
    />
  );
};
