import axios, { AxiosError } from "axios";
import { ErrorMessage, webAPIUrl } from "./Settings";

export type ServiceMethod = 'delivery' | 'pickup';
type OrderStatus = 'registered' | 'onDelivery' | 'completed' | 'canceling' | 'canceled';
type PriceUnitType = 'ea' | 'kg';

export type OrderSimple = {
    orderId: number,
    serviceMethod: ServiceMethod,
    totalAmount: number,
    chosenAddress: string,
    chosenDate: string,
    orderStatus: OrderStatus,
    orderDate: string
};

export type OrderItemType = {
    orderItemId: number,
    productId: number,
    productName: string,
    price: number,
    priceUnitType: PriceUnitType,
    image: string,
    quantity: number,
    totalPrice: number
};

export type OrderContent = {
    orderId: number,
    orderItems: OrderItemType[],
    subTotalAmount: number,
    serviceMethod: ServiceMethod,
    bagFee: number,
    serviceFee: number,
    totalAmount: number,
    chosenAddress: string,
    chosenDate: string,
    orderStatus: OrderStatus,
    orderDate: string
};

type CancelOrderResponse = {
    orderId: number,
    orderStatus: OrderStatus
};

export const getOrders = async (token: string): Promise<OrderSimple[] | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/orders`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const getOrder = async (orderId: number, token: string): Promise<OrderContent | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/orders/${orderId}`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const cancelOrder = async (orderId: number, token: string): Promise<CancelOrderResponse | ErrorMessage> => {
    try{
        const response = await axios.delete(`${webAPIUrl}/orders/${orderId}`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}