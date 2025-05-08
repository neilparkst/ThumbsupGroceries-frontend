import axios, { AxiosError } from "axios";
import { ErrorMessage, webAPIUrl } from "./Settings";

type PriceUnitType = 'ea' | 'kg';
export type ServiceMethod = 'delivery' | 'pickup';
type TrolleyTimeSlotStatus = 'available' | 'unavailable';

export type TrolleyCountResponse = {
    trolleyId: number,
    itemCount: number
};

export type TrolleyItemType = {
    trolleyItemId: number
    productId: number,
    productName: string,
    productPrice: number,
    productPriceUnitType: PriceUnitType,
    image: string,
    quantity: number,
    totalPrice: number
};

type TrolleyContent = {
    trolleyId: number,
    itemCount: number,
    items: TrolleyItemType[],
    subTotalPrice: number,
    method: ServiceMethod,
    serviceFee: number,
    bagFee: number,
    totalPrice: number
};

export type TrolleyItemRequest = {
    productId: number,
    priceUnitType: PriceUnitType,
    quantity: number
};

type TrolleyItemResponse = {
    trolleyItemId: number,
    productId: number,
    priceUnitType: PriceUnitType,
    quantity: number
};

export type TrolleyItemDeleteResponse = {
    trolleyItemId: number,
    productId: number
};

export type TrolleyTimeSlot = {
    timeSlotId: number,
    start: string,
    end: string,
    status: TrolleyTimeSlotStatus
};

type TrolleyItemForValidationRequest = {
    productId: number,
    productPrice: number,
    priceUnitType: PriceUnitType,
    quantity: number,
    totalPrice: number
};

type TrolleyValidationRequest = {
    trolleyId: number,
    items: TrolleyItemForValidationRequest[],
    subTotalPrice: number,
    method: ServiceMethod,
    serviceFee: number,
    bagFee: number,
    totalPrice: number
};

type TrolleyValidationResponse = {
    isValid: boolean
};

type TrolleyCheckoutSessionRequest = {
    trolleyId: number,
    chosenDate: string,
    chosenAddress: string,
    successUrl: string,
    cancelUrl: string
};

type TrolleyCheckoutSessionResposne = {
    url: string
};

export const getTrolleyCount = async (token: string): Promise<TrolleyCountResponse | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/trolley/count`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const getTrolleyContent = async (token: string): Promise<TrolleyContent | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/trolley`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const addTrolleyItem = async (request: TrolleyItemRequest, token: string): Promise<TrolleyItemResponse | ErrorMessage> => {
    try{
        const response = await axios.post(
            `${webAPIUrl}/trolley`,
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

export const updateTrolleyItem = async (trolleyItemId: number, request: TrolleyItemRequest, token: string): Promise<TrolleyItemResponse | ErrorMessage> => {
    try{
        const response = await axios.put(
            `${webAPIUrl}/trolley/${trolleyItemId}`,
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

export const removeTrolleyItem = async (trolleyItemId: number, token: string): Promise<TrolleyItemDeleteResponse | ErrorMessage> => {
    try{
        const response = await axios.delete(`${webAPIUrl}/trolley/${trolleyItemId}`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const removeTrolleyItems = async (trolleyItemIds: number[], token: string): Promise<TrolleyItemDeleteResponse[] | ErrorMessage> => {
    try{
        const response = await axios.post(`${webAPIUrl}/trolley/bulk-deletion`, trolleyItemIds, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const getTimeSlots = async (serviceMethod: ServiceMethod): Promise<TrolleyTimeSlot[] | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/trolley/time-slot/${serviceMethod}`);

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const validateTrolley = async (request: TrolleyValidationRequest, token: string): Promise<TrolleyValidationResponse | ErrorMessage> => {
    try{
        const response = await axios.post(
            `${webAPIUrl}/trolley/validation`,
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

export const getTrolleyCheckoutUrl = async (request: TrolleyCheckoutSessionRequest, token: string): Promise<TrolleyCheckoutSessionResposne | ErrorMessage> => {
    try{
        const response = await axios.post(
            `${webAPIUrl}/trolley/checkout-session`,
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