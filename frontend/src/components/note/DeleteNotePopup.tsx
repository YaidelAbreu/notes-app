import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { NewNote, Note, deleteNote, getNote } from "../../slices/notesSlice";
import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import FormModal from "../modal/FormModal";

interface DeleteNotePopupProps {
  id: string | null;
}

const DeleteNotePopup = ({ id }: DeleteNotePopupProps) => {
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

  const handleSubmit = () => {
    if (id) {
      dispatch(deleteNote(id));
    }
  };

  return (
    <>
      <FormModal
        title="Delete Note"
        onSubmit={handleSubmit}
        classNames="task modal-form"
      >
        <Grid container>
          <Typography variant="h5" display="block" gutterBottom>
            "Are you sure you want to delete this note?"
          </Typography>
        </Grid>
      </FormModal>
    </>
  );
};

export default DeleteNotePopup;
