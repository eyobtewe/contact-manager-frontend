import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { UpdateContact } from '@/models/schema';

export function useContacts() {
  const queryClient = useQueryClient();

  const contactsQuery = useQuery({
    queryKey: ['contacts'],
    queryFn: api.getContacts,
  });

  const createContactMutation = useMutation({
    mutationFn: api.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: ({ id, contact }: { id: string; contact: UpdateContact }) =>
      api.updateContact(id, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: api.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const exportContactsMutation = useMutation({
    mutationFn: api.exportContacts,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacts.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });



  return {
    contacts: contactsQuery.data ?? [],
    isLoading: contactsQuery.isLoading,
    error: contactsQuery.error,
    createContact: createContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    exportContacts: exportContactsMutation.mutate,
  };
} 