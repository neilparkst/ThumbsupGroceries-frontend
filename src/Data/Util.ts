import { ErrorMessage } from "./Settings"

export const isErrorMessage = (obj: ErrorMessage | any) => {
    return (obj as ErrorMessage).errorMessage !== undefined;
}