import type { ContactFormState } from "./submit-contact";

export const initialState: ContactFormState = {
    ok: false,
    message: "",
    fieldErrors: {},
    values: {},
};