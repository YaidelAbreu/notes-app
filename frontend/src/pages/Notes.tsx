import NotesTable from "../components/note/NotesTable";
import PageHeader from "../components/headers/PageHeader";
import AddButton from "../components/buttons/AddButton";
import { openModal } from "../slices/modalSlice";
import { useAppDispatch } from "../hooks/redux-hooks";
import Grid from "@mui/material/Grid";

export default function Notes() {
  const dispatch = useAppDispatch();

  const openModalAddNote = () => {
    dispatch(openModal({ modalName: "addNote", modalProps: {} }));
  };

  const handleOpenUpdateNotePopup = (id: number) => {
    dispatch(
      openModal({ modalName: "updateNote", modalProps: { noteId: id } })
    );
  };

  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item>
          <PageHeader title="Notes" />
        </Grid>
        <Grid item>
          <AddButton
            text="Create Note"
            onClickAction={() => {
              openModalAddNote();
            }}
          />
        </Grid>
      </Grid>

      <NotesTable onClickEdit={handleOpenUpdateNotePopup} />
    </>
  );
}