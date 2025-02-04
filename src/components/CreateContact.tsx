import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContacts } from "@/hooks/useContacts";
import { useState } from "react";
import { isCreatingAtom } from "@/state/atom";
import { useSetAtom } from "jotai";
import { XIcon } from "lucide-react";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const CreateContact = () => {
  const setIsCreating = useSetAtom(isCreatingAtom);
  const { createContact } = useContacts();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    bookmarked: false
  });
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone: string) => {
    try {
      return isValidPhoneNumber(phone);
    } catch (error) {
      return false;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, phone: value }));

    if (value && !validatePhone(value)) {
      setPhoneError('Please enter a valid phone number (e.g., +1 234 567 8900)');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(form.phone)) {
      setPhoneError('Please enter a valid phone number (e.g., +1 234 567 8900)');
      return;
    }

    // Optionally format the phone number before saving
    try {
      const phoneNumber = parsePhoneNumber(form.phone);
      if (phoneNumber) {
        const formattedPhone = phoneNumber.formatInternational();
        createContact({ ...form, phone: formattedPhone });
      }
    } catch (error) {
      createContact(form);
    }

    setIsCreating(false);
  };

  return (
    <Card className="border-0">
      <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">New Contact</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
          <XIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Input
              placeholder="Phone (+1 234 567 8900)"
              type="tel"
              required
              value={form.phone}
              onChange={handlePhoneChange}
              className={phoneError ? 'border-red-500' : ''}
            />
            {phoneError && (
              <p className="text-sm text-red-500 mt-1">{phoneError}</p>
            )}
          </div>
          <div>
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
          >
            Create Contact
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateContact; 