import axios, { AxiosError } from "axios";
import { ErrorMessage, webAPIUrl } from "./Settings";

type UserRole = 'Customer' | 'Admin';
type UserMembershipStatus = 'active' | 'pastDue' | 'canceled';

export type TokenUserInfoType = {
    userId: string,
    username: string,
    role: UserRole
};

export type UserInfoType = {
    email: string,
    username: string,
    phoneNumber: string,
    firstName: string,
    lastname: string,
    address: string,
}

type UserInfoUpdateRequest = {
    username?: string,
    phoneNumber?: string,
    firstName?: string,
    lastname?: string,
    address?: string
};

type UserUpdateResponse = {
    token: string
}

type UserPasswordUpdateRequest = {
    oldPassword: string,
    newPassword: string
}

export type UserMembership = {
    membershipId: number,
    planId: number,
    planName: string,
    planPrice: number,
    startDate: string,
    renewalDate: string,
    status: UserMembershipStatus
};

type MembershipPortalSessionRequest = {
    returnUrl: string
}

type MembershipPortalSessionResponse = {
    url: string
}

export const getMyInfo = async (token: string): Promise<UserInfoType | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/users/me`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const updateMyInfo = async (request: UserInfoUpdateRequest, token: string): Promise<UserUpdateResponse | ErrorMessage> => {
    try{
        const response = await axios.put(`${webAPIUrl}/users/me`, request, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const updateMyPassword = async (request: UserPasswordUpdateRequest, token: string): Promise<UserUpdateResponse | ErrorMessage> => {
    try{
        const response = await axios.put(`${webAPIUrl}/users/me/password`, request, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const deleteMyAccount = async (token: string): Promise<{userId: string} | ErrorMessage> => {
    try{
        const response = await axios.delete(`${webAPIUrl}/users/me`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const getMyMembership = async (token: string): Promise<UserMembership | {} | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/users/me/membership`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const getMembershipPortalUrl = async (request: MembershipPortalSessionRequest, token: string): Promise<MembershipPortalSessionResponse | ErrorMessage> => {
    try{
        const response = await axios.post(`${webAPIUrl}/users/me/membership/portal-session`, request, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

