import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { useParams } from "react-router-dom";
import { getNote, Note } from "../slices/notesSlice";
import PageHeader from "../components/headers/PageHeader";
import { Typography } from "@mui/material";

export default function ViewNote() {
  const dispatch = useAppDispatch();
  const selectedNote = useAppSelector((state) => state.notes.selectedNote);

  const { id } = useParams();
  const [note, setNote] = useState<Note>();

  useEffect(() => {
    if (id) {
      dispatch(getNote(id));
    }
  }, [id]);

  useEffect(() => {
    if (selectedNote) {
      setNote({
        ...selectedNote
      });
    } else {
      // TODO: Show error msg
    }
  }, [selectedNote]);

  return (
    <>
      {note && (
        <>
          <PageHeader title="Note" />
          <Typography variant="h5">ID: {note.id}</Typography>
          <Typography variant="h5">Title: {note.title}</Typography>
          <Typography variant="h5">Content: {note.content}</Typography>
        </>
      )}
    </>
  );
}
