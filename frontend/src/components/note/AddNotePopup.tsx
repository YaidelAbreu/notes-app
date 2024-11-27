import { useAppDispatch } from "../../hooks/redux-hooks";
import { NewNote, createNote } from "../../slices/notesSlice";
import { useState } from "react";
import NotePopup from "./NotePopup";
interface AddNotePopupProps {
  //   open: boolean;
}

const AddNotePopup = ({}: AddNotePopupProps) => {
  const dispatch = useAppDispatch();

  const [note, setNote] = useState<NewNote>({
    title: "",
    content: ""
  });

  const submitNewNote = () => {
    if (note.title && note.content) {
      dispatch(createNote(note as NewNote));
    }
  };

  return (
    <>
      <NotePopup
        title="Create Note"
        note={note}
        setNote={setNote}
        onSubmit={submitNewNote}
      />
    </>
  );
};

export default AddNotePopup;
