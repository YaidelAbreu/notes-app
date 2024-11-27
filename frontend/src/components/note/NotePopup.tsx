import { Grid, SelectChangeEvent } from "@mui/material";
import { NewNote, Note } from "../../slices/notesSlice";
import FormTextField from "../forms/FormTextField";
import FormModal from "../modal/FormModal";
import FormTextAreaField from "../forms/FormTextAreaField";

interface NotePopupProps {
  title: string;
  note: Note | NewNote;
  setNote: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
}

const NotePopup = ({ title, note, setNote, onSubmit }: NotePopupProps) => {
  const handleSubmit = () => {
    onSubmit();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | null>
  ) => {
    setNote({
      ...note,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <FormModal
        title={title}
        onSubmit={handleSubmit}
        classNames="task modal-form"
      >
        <Grid container>
          <Grid item xs={12} mt={2}>
            <FormTextField
              label="Title"
              name="title"
              value={note.title}
              isRequired={true}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} mt={2}>
            <FormTextAreaField
              label="Content"
              name="content"
              value={note.content}
              isRequired={true}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </FormModal>
    </>
  );
};

export default NotePopup;
