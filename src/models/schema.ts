import { z } from "zod";


export const baseContactSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  phone: z.string().regex(/^[\+\-\s\(\)0-9]+$/, "Invalid phone number format"), // E.164 format
  email: z.string().email().optional(),
  bookmarked: z.boolean().default(false),
});
export type Contact = z.infer<typeof baseContactSchema>


// Schema for list of contacts
export const contactListSchema = z.array(baseContactSchema);
export type ContactList = z.infer<typeof contactListSchema>;

// Schema for creating a contact (excludes `id`)
export const createContactSchema = baseContactSchema.omit({ id: true });
export type CreateContact = z.infer<typeof createContactSchema>;

// Schema for updating a contact (partial fields for PATCH)
export const updateContactSchema = baseContactSchema.partial();
export type UpdateContact = z.infer<typeof updateContactSchema>;

// Schema for validating contact ID (for DELETE, PATCH)
export const contactIdSchema = baseContactSchema.pick({ id: true });
export type ContactId = z.infer<typeof contactIdSchema>;




// Define a schema for an array of contacts

