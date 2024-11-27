import { GridColDef } from "@mui/x-data-grid";
import Table from "../table/Table";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { getNotes } from "../../slices/notesSlice";
import { useEffect } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import DeleteIcon from "@mui/icons-material/Delete";

interface NotesTableProps {
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

export default function NotesTable({
  onClickEdit,
  onClickDelete
}: NotesTableProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const notes = useAppSelector((state) => state.notes.notes);
  const noteStatus = useAppSelector((state) => state.notes.status);

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "content", headerName: "Content", width: 500 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              color="info"
              aria-label="view-note"
              onClick={() => {
                onClickView(params.row.id);
              }}
            >
              <WysiwygIcon />
            </IconButton>
            <IconButton
              color="warning"
              aria-label="edit-note"
              onClick={() => onClickEdit(params.row.id)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="warning"
              aria-label="delete-note"
              onClick={() => onClickDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      }
    }
  ];

  const onClickView = (id: number) => {
    navigate(`/notes/${id}`);
  };

  useEffect(() => {
    if (noteStatus === "idle") {
      dispatch(getNotes());
    }
  }, [dispatch]);

  const onClickNote = (id: string | number) => {
    console.error("Clicked on note id: " + id);
    // navigate(`/dashboards/${id}`);
  };

  return <Table columns={columns} rows={notes} onClickRow={onClickNote} />;
}
