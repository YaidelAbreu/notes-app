import AddNotePopup from "../components/note/AddNotePopup";
import UpdateNotePopup from "../components/note/UpdateNotePopup";
import DeleteNotePopup from "../components/note/DeleteNotePopup";
import { useAppSelector } from "../hooks/redux-hooks";

// Import other modal components

const ModalContainer = () => {
  const openModal = useAppSelector((state) => state.modal.openModal);
  const modalProps = useAppSelector((state) => state.modal.modalProps);

  const renderModal = () => {
    switch (openModal) {
      case "addNote":
        return <AddNotePopup />;
      case "updateNote":
        return <UpdateNotePopup id={modalProps?.id} />;
      case "deleteNote":
        return <DeleteNotePopup id={modalProps?.id} />;
      // Add other cases for different modals
      default:
        return null;
    }
  };

  return <>{renderModal()}</>;
};

export default ModalContainer;
