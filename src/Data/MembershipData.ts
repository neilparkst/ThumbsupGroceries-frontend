import axios, { AxiosError } from "axios"
import { ErrorMessage, webAPIUrl } from "./Settings"

export type MembershipOptionType = {
    planId: number,
    name: string,
    price: number,
    durationMonths: number,
    description: string
};

type MembershipCheckoutSessionRequest = {
    planId: number,
    successUrl: string,
    cancelUrl: string
};

type MembershipCheckoutSessionResposne = {
    url: string
};

export const getMembershipOptions = async (): Promise<MembershipOptionType[] | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/membership`);

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const getMembershipCheckoutUrl = async (request: MembershipCheckoutSessionRequest, token: string): Promise<MembershipCheckoutSessionResposne | ErrorMessage> => {
    try{
        const response = await axios.post(
            `${webAPIUrl}/membership/checkout-session`,
            request,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}