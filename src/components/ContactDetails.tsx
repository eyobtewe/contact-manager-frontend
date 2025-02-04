import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isCreatingAtom, selectedContactAtom, mobileViewAtom } from "@/state/atom";
import { useAtom } from "jotai";
import CreateContact from "./CreateContact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useContacts } from "@/hooks/useContacts";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PencilIcon, CheckIcon, XIcon, ArrowLeft } from "lucide-react";

const ContactDetails = () => {
  const [selectedContact] = useAtom(selectedContactAtom);
  const [isCreating] = useAtom(isCreatingAtom);
  const [isEditing, setIsEditing] = useState(false);
  const { updateContact } = useContacts();
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [, setMobileView] = useAtom(mobileViewAtom);

  const handleEdit = () => {
    if (!selectedContact) return;
    setEditForm({
      name: selectedContact.name,
      email: selectedContact.email || '',
      phone: selectedContact.phone || ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedContact) return;
    updateContact({
      id: selectedContact.id,
      contact: editForm
    });
    setIsEditing(false);
  };
  const getRandomImage = (name: string) => `https://robohash.org/${name}`;
  // const getAvatarUrl = (id: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;

  return (
    <section className="md:col-span-1 lg:col-span-5 bg-white rounded-lg shadow-lg">
      {isCreating ? (
        <CreateContact />
      ) : selectedContact ? (
        <Card className="border-0">
          <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
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
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={getRandomImage(selectedContact.name || '')} alt={selectedContact?.name || ''} />
              </Avatar>
              {isEditing ? (
                <div className="space-y-4 flex-1">
                  <Input
                    placeholder="Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    placeholder="Phone"
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      <XIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">{selectedContact.name}</h2>
                  <p className="text-gray-600">{selectedContact.email}</p>
                  {selectedContact.phone && (
                    <p className="text-gray-600">{selectedContact.phone}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )
        :
        (
          // <></>
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a contact to view details
          </div>
        )
      }
    </section>
  );
};

export default ContactDetails; 