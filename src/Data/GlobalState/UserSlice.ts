import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenUserInfoType } from "../UserData";
import { jwtDecode } from "jwt-decode";

type UserState = {
    token: string | null;
    info: TokenUserInfoType | null;
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

            const decoded = jwtDecode(action.payload) as TokenUserInfoType;
            state.info = decoded;
        },
    }
})

// ACTION
export const {
    registerTokenAndUserInfo
} = userSlice.actions;