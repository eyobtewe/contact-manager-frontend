import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, XIcon } from "lucide-react";

interface ContactEditFormProps {
  editForm: {
    name: string;
    email: string;
    phone: string;
  };
  setEditForm: (form: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ContactEditForm = ({ editForm, setEditForm, onSave, onCancel }: ContactEditFormProps) => (
  <div className="space-y-4 flex-1">
    <Input
      placeholder="Name"
      value={editForm.name}
      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
    />
    <Input
      placeholder="Email"
      type="email"
      value={editForm.email}
      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
    />
    <Input
      placeholder="Phone"
      type="tel"
      value={editForm.phone}
      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
    />
    <div className="flex gap-2">
      <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
        <CheckIcon className="h-4 w-4 mr-2" />
        Save
      </Button>
      <Button variant="ghost" onClick={onCancel}>
        <XIcon className="h-4 w-4 mr-2" />
        Cancel
      </Button>
    </div>
  </div>
); 