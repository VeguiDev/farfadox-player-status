import { createSlice } from "@reduxjs/toolkit";
import { useMemo } from "react";

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

export const usePlayerReducers = useMemo(() => playerSplice.actions, []);

export default playerSplice.reducer;