import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { Note, getNote, updateNote } from "../../slices/notesSlice";
import { useEffect, useState } from "react";
import NotePopup from "./NotePopup";

interface UpdateNotePopupProps {
  id: string | null;
}

const UpdateNotePopup = ({ id }: UpdateNotePopupProps) => {
  const dispatch = useAppDispatch();
  const selectedNote = useAppSelector((state) => state.notes.selectedNote);

  const [note, setNote] = useState<Note>({
    id: "",
    title: "",
    content: "",
    version: 1
  });

  useEffect(() => {
    if (id) {
      dispatch(getNote(id));
    }
  }, [id]);

  useEffect(() => {
    if (selectedNote) {
      setNote({ ...selectedNote });
    }
  }, [selectedNote]);

  const submitUpdateNote = () => {
    dispatch(updateNote(note));
  };

  return (
    <>
      <NotePopup
        title="Update Project"
        note={note}
        setNote={setNote}
        onSubmit={submitUpdateNote}
      />
    </>
  );
};

export default UpdateNotePopup;
