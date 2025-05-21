import axios, { AxiosError } from "axios";
import { ErrorMessage, webAPIUrl } from "./Settings";

type PriceUnitType = 'ea' | 'g';

export type Product = {
    productId: number,
    name: string,
    price: number,
    priceUnitType: PriceUnitType,
    description: string,
    images: string[],
    quantity: number,
    categories: number[],
    rating: number,
    reviewCount: number
};

export type ProductAddRequest = {
    name: string,
    price: number,
    priceUnitType: PriceUnitType,
    description?: string,
    images?: File[],
    quantity: number,
    categories: number[]
};

export type ProductUpdateRequest = {
    name?: string,
    price?: number,
    priceUnitType?: PriceUnitType,
    description?: string,
    images?: File[],
    quantity?: number | null,
    addedQuantity?: number,
    categories?: number[]
};

export type ProductSimple = {
    productId: number,
    name: string,
    price: number,
    priceUnitType: PriceUnitType,
    image: string,
    rating: number,
    reviewCount: number
};

export type CategoryTree = {
    categoryId: number,
    name: string,
    children: CategoryTree
}[];

export type ReviewType = {
    reviewId: number,
    userId: string,
    userName: string,
    comment: string,
    rating: number,
    createdAt: string,
    updatedAt: string
};

type ReviewAddRequest = {
    comment: string,
    rating: number
};

export const getProduct = async (productId: number): Promise<Product | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/products/${productId}`);

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const addProduct = async (request: ProductAddRequest, token: string): Promise<{productId: number} | ErrorMessage> => {
    try{
        const formData = new FormData();
        formData.append('name', request.name);
        formData.append('price', request.price.toString());
        formData.append('priceUnitType', request.priceUnitType);
        if(request.description){
            formData.append('description', request.description);
        }
        if(request.images){
            request.images.forEach(image => formData.append('images', image));
        }
        formData.append('quantity', request.quantity.toString());
        request.categories.forEach(category => formData.append('categories', category.toString()));

        const response = await axios.post(
            `${webAPIUrl}/products`,
            formData,
            {
                headers:{
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const updateProduct = async (productId: number, request: ProductUpdateRequest, token: string): Promise<{productId: number} | ErrorMessage> => {
    try{
        const formData = new FormData();
        request.name && formData.append('name', request.name);
        request.price && formData.append('price', request.price.toString());
        request.priceUnitType && formData.append('priceUnitType', request.priceUnitType);
        request.description && formData.append('description', request.description);
        request.images && request.images.forEach(image => formData.append('images', image));
        request.quantity && formData.append('quantity', request.quantity.toString());
        request.addedQuantity && formData.append('addedQuantity', request.addedQuantity.toString());
        request.categories && request.categories.forEach(category => formData.append('categories', category.toString()));

        const response = await axios.patch(
            `${webAPIUrl}/products/${productId}`,
            formData,
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

export const removeProduct = async (productId: number, token: string): Promise<{productId: number} | ErrorMessage> => {
    try{
        const response = await axios.delete(`${webAPIUrl}/products/${productId}`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const getProducts = async (
    categoryId?: number,
    sort: string = "relevance",
    search: string = "",
    page: number = 1,
    pageSize: number = 24
): Promise<ProductSimple[] | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/products?${categoryId ? `categoryId=${categoryId}&` : ''}sort=${sort}&search=${search}&page=${page}&pageSize=${pageSize}`);

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const getCategoryTree = async (): Promise<CategoryTree | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/products/categories`);

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const getReviews = async (productId: number, page: number = 1, pageSize: number = 5): Promise<ReviewType[] | ErrorMessage> => {
    try{
        const response = await axios.get(`${webAPIUrl}/products/${productId}/reviews?page=${page}&pageSize=${pageSize}`);

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}

export const addReview = async (productId: number, request: ReviewAddRequest, token: string) : Promise<{reviewId: number} | ErrorMessage> => {
    try{
        const response = await axios.post(
            `${webAPIUrl}/products/${productId}/reviews`,
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

export const updateReview = async (productId: number, reviewId: number, request: ReviewAddRequest, token: string) : Promise<{reviewId: number} | ErrorMessage> => {
    try{
        const response = await axios.put(
            `${webAPIUrl}/products/${productId}/reviews/${reviewId}`,
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

export const removeReview = async (productId: number, reviewId: number, token: string) : Promise<{reviewId: number} | ErrorMessage> => {
    try{
        const response = await axios.delete(`${webAPIUrl}/products/${productId}/reviews/${reviewId}`, {headers: {Authorization: `Bearer ${token}`}});

        return response.data;
    } catch (error){
        const e = error as AxiosError;
        return {errorMessage: ((e.response?.data as {title: string})?.title ?? e.response?.data) || "error occurred!"};
    }
}