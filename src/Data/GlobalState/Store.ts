import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./UserSlice";

// STORE
export function getStore(){
    const store = configureStore({
        reducer: {
            user: userSlice.reducer
        }
    });
    return store;
}

export type GlobalState = ReturnType<ReturnType<typeof getStore>["getState"]>;
export type GlobalDispatch = ReturnType<typeof getStore>["dispatch"];