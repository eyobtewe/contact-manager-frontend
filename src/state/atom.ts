import { Contact } from "@/models/schema";
import { atom } from "jotai";

export const selectedContactAtom = atom<Contact | null>(null);
export const isCreatingAtom = atom(false);
export const searchQueryAtom = atom("");
export const filterLetterAtom = atom<string | null>(null);
export const mobileViewAtom = atom<'list' | 'details' | 'create'>('list');