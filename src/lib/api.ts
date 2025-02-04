import axios from 'axios';
import {
  Contact,
  ContactList,
  CreateContact,
  UpdateContact
} from "@/models/schema";
import dotenv from 'dotenv';

dotenv.config();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export async function getContacts(): Promise<ContactList> {
  const { data } = await api.get('/contacts');
  return data;
}

export async function createContact(contact: CreateContact): Promise<Contact> {
  const { data } = await api.post('/contacts', contact);
  return data;
}

export async function updateContact(id: string, contact: UpdateContact): Promise<Contact> {
  const { data } = await api.patch(`/contacts/${id}`, contact);
  return data;
}

export async function deleteContact(id: string): Promise<void> {
  await api.delete(`/contacts/${id}`);
}

export async function exportContacts(): Promise<Blob> {
  const { data } = await api.get('/contacts/export', {
    responseType: 'blob'
  });
  return data;
}

// Error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'An error occurred';
    throw new Error(message);
  }
); 