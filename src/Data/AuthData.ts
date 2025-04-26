import axios, { AxiosError } from "axios"
import { ErrorMessage, webAPIUrl } from "./Settings"

type SignUpRequest = {
    email: string,
    password: string,
    userName: string,
    phoneNumber?: string,
    firstName?: string,
    lastName?: string,
    address?: string
};

export type SignUpResponse = {
    userId: string,
    email: string
};

type SignInRequest = {
    email: string,
    password: string
};

export type SignInResponse = {
    token: string
};

export const signUp = async (request: SignUpRequest): Promise<SignUpResponse | ErrorMessage> => {
    try{
        const response = await axios.post(
            `${webAPIUrl}/auth/signup`,
            request
        );

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const signIn = async (request: SignInRequest): Promise<SignInResponse | ErrorMessage> => {
    try{
        const response = await axios.post(
            `${webAPIUrl}/auth/signin`,
            request
        );
        
        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}