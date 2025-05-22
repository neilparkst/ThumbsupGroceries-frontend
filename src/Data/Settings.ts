export const domain = process.env.REACT_APP_ENV === 'production' ? "https://thumbsupgroceries-backend20250522175724.azurewebsites.net/" : "https://localhost:7192";

export const webAPIUrl = `${domain}/api/v1`;

export type ErrorMessage = {errorMessage: string};