import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";

export type NewNote = {
  title: string;
  content: string;
};

export type Note = NewNote & {
  id: string;
  version: number;
};

export type EditNote = NewNote & {
  version: number;
};

export type NoteUpdateResponse = {
  success: Boolean;
  message: string;
  note?: Note;
};

interface NoteState {
  notes: Note[];
  selectedNote: Note | undefined;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  selectedNote: undefined,
  status: "idle",
  error: null
};

export const getNotes = createAsyncThunk(
  "notes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/notes");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const getNote = createAsyncThunk(
  "notes/getOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const createNote = createAsyncThunk(
  "notes/createOne",
  async (note: NewNote, { rejectWithValue }) => {
    try {
      const notePayload: NewNote = {
        title: note.title,
        content: note.content
      };
      const response = await axiosInstance.post("/notes", notePayload);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const updateNote = createAsyncThunk(
  "projects/updateOne",
  async (note: Note, { rejectWithValue }) => {
    try {
      const updateProjectPayload: EditNote = {
        title: note.title,
        content: note.content,
        version: note.version
      };
      const response = await axiosInstance.put(
        `/notes/${note.id}`,
        updateProjectPayload
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/notes/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorResponse = error.response.data;

        return rejectWithValue(errorResponse);
      }

      throw error;
    }
  }
);

export const noteSlice = createSlice({
  name: "Notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.status = "idle";
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state) => {
        state.status = "failed";
        state.notes = [];
      })
      .addCase(getNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.status = "idle";
        state.selectedNote = action.payload;
      })
      .addCase(getNote.rejected, (state) => {
        state.status = "failed";
        state.selectedNote = undefined;
      })
      .addCase(createNote.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createNote.fulfilled,
        (state, action: PayloadAction<Note>) => {
          state.status = "idle";
          state.notes.push(action.payload);
        }
      )
      .addCase(createNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add note.";
      })
      .addCase(updateNote.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateNote.fulfilled,
        (state, action: PayloadAction<NoteUpdateResponse>) => {         
          const response = action.payload;

          const index = state.notes.findIndex(
            (note) => note.id === response.note?.id
          );

          if (index !== -1) {
              state.notes[index] = response.note?.id ? response?.note: state.notes[index];
          }

          state.status = response.success ? "idle": "failed";
          state.error = "The note has been modified by another process at the same time. Please try again.";
        }
      )
      .addCase(updateNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update note.";
      })
      .addCase(deleteNote.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.status = "idle";
        const entityId = action.payload.id;
        state.notes = state.notes.filter((note) => note.id !== entityId);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete note.";
      });
  }
});

export default noteSlice.reducer;
