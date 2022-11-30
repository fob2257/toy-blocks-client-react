import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetch from "cross-fetch";

import { Node } from "../types/Node";
import { Block } from "../types/Block";
import { RootState } from "../store/configureStore";

export interface BlocksState {
  list: Block[];
  loading: boolean;
  error: boolean;
}

export const fetchNodeBlocks = createAsyncThunk(
  "nodes/fetchNodeBlocks",
  async (node: Node) => {
    const response = await fetch(`${node.url}/api/v1/blocks`);
    const { data } = await response.json();
    return data;
  }
);

export const initialState: BlocksState = {
  list: [],
  loading: false,
  error: false,
};

export const blocksSlice = createSlice({
  name: "blocks",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNodeBlocks.pending, (state) => {
      state.error = false;
      state.loading = true;
      state.list = [];
    });

    builder.addCase(fetchNodeBlocks.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.list = action.payload;
    });

    builder.addCase(fetchNodeBlocks.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const selectBlocks = (state: RootState) => state.blocks.list;
export const selectLoading = (state: RootState) => state.blocks.loading;
export const selectError = (state: RootState) => state.blocks.error;

export default blocksSlice.reducer;
