import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isCreatingAtom, selectedContactAtom, mobileViewAtom } from "@/state/atom";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { useContacts } from "@/hooks/useContacts";
import { PencilIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactAvatar } from "./contact/ContactAvatar";
import { ContactEditForm } from "./contact/ContactEditForm";

import CreateContact from "./CreateContact";
import { toast } from "@/hooks/use-toast";


const ContactDetails = () => {
  const [selectedContact, setSelectedContact] = useAtom(selectedContactAtom);
  const [isCreating] = useAtom(isCreatingAtom);
  const [isEditing, setIsEditing] = useState(false);
  const { updateContact } = useContacts();
  const [, setMobileView] = useAtom(mobileViewAtom);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleEdit = () => {
    if (!selectedContact) return;
    setEditForm({
      name: selectedContact.name,
      email: selectedContact.email || '',
      phone: selectedContact.phone || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedContact) return;
    try {
      await updateContact({
        id: selectedContact.id,
        contact: editForm
      });
      setSelectedContact(null)
      setIsEditing(false);
      toast({ description: 'Contact edited successfully!' });
    } catch (error) {
      console.error('Failed to update contact:', error);
      // Optionally add error handling UI here
    }
  };

  // Reset edit form when selected contact changes
  useEffect(() => {
    if (selectedContact) {
      setEditForm({
        name: selectedContact.name,
        email: selectedContact.email || '',
        phone: selectedContact.phone || ''
      });
    }
  }, [selectedContact]);

  if (isCreating) return <CreateContact />;
  if (!selectedContact) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <span className="i-lucide-user-x2 h-8 w-8 mr-2 opacity-50" />
        Select a contact to view details
      </div>
    );
  }

  return (
    <Card className="border-0 h-full">
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileView('list')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-semibold">Contact Details</CardTitle>
        </div>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start gap-6 mb-6">
          <ContactAvatar name={selectedContact.name} />
          {isEditing ? (
            <ContactEditForm
              editForm={editForm}
              setEditForm={setEditForm}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{selectedContact.name}</h2>
              {selectedContact.email && (
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="i-lucide-mail h-4 w-4" />
                  {selectedContact.email}
                </p>
              )}
              {selectedContact.phone && (
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="i-lucide-phone h-4 w-4" />
                  {selectedContact.phone}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactDetails; 