import { createSlice } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { RootState } from "../../store";

export const playerSplice = createSlice({
    name: 'player',
    initialState: {
        isPlaying: false,
        isPaused: false,
        status: null
    },
    reducers: {
        clearStatus: (state) => {
            state.isPaused = false;
            state.isPlaying = false;
            state.status = null;
        },
        setStatus: (state, action) => {

            let newStatus = action.payload;

            if(newStatus.status && newStatus.status == "not_playing") {
                state.isPaused = false;
                state.isPlaying = false;
                state.status = null;
            } else {
                state.isPaused = !newStatus.is_playing;
                state.isPlaying = true;
                state.status = newStatus;
            }

        }
    }
})

export const usePlayerReducers = () => playerSplice.actions;
export const selectPlayer = (state: RootState) => state.player

export default playerSplice.reducer;