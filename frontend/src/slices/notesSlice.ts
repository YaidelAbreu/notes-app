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
      });
  }
});

export default noteSlice.reducer;
