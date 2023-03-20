import { writable, type Writable } from "svelte/store";
import type { ToastType } from "./types/toastTypes";
import type { UserType } from "./types/userTypes";

export const user: Writable<UserType | null> = writable(null);

export const toast: Writable<ToastType | null> = writable(null);
