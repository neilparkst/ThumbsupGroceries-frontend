import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "../UserData";
import { jwtDecode } from "jwt-decode";

type UserState = {
    token: string | null;
    info: UserInfo | null;
};

// STATE
const initialUserState: UserState = {
    token: null,
    info: null
}

// SLICE
export const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers:{
        registerTokenAndUserInfo(state, action: PayloadAction<string>){
            state.token = action.payload;

            const decoded = jwtDecode(action.payload) as UserInfo;
            state.info = decoded;
        },
    }
})