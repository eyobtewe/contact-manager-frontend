import { Button } from "@/components/ui/button";
import { isCreatingAtom, selectedContactAtom } from "@/state/atom";
import { useAtom } from "jotai";
import { useContacts } from "@/hooks/useContacts";
import { Download } from "lucide-react";

const LeftSidebar = () => {
    const [, setIsCreating] = useAtom(isCreatingAtom);
    const [, setSelectedContact] = useAtom(selectedContactAtom);
    const { exportContacts } = useContacts();

    return (
        <aside className="md:col-span-1 lg:col-span-2 bg-gray-100 p-4 rounded-lg space-y-2">
            <Button className="w-full" onClick={() => { setIsCreating(true); setSelectedContact(null); }}>
                + New Contact
            </Button>
            <Button
                variant="outline"
                className="w-full"
                onClick={() => exportContacts()}
            >
                <Download className="h-4 w-4 mr-2" />
                Export Contacts
            </Button>
        </aside>
    );
};

export default LeftSidebar;