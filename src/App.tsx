import './App.css'
import { useAtom } from 'jotai';
import LeftSidebar from "@/components/LeftSideBar";
import ContactList from "@/components/ContactList";
import ContactDetails from "@/components/ContactDetails";
import { mobileViewAtom, selectedContactAtom, isCreatingAtom } from '@/state/atom';

import { Toaster } from "@/components/ui/toaster"

function App() {
    const [mobileView] = useAtom(mobileViewAtom);
    const [selectedContact] = useAtom(selectedContactAtom);
    const [isCreating] = useAtom(isCreatingAtom);

    return (
        <>

            <Toaster />
            <div className=" container flex flex-col md:flex-row gap-4 p-4 h-screen max-h-screen">
                <div className="hidden md:block w-48 flex-shrink-0">
                    <LeftSidebar />
                </div>
                <div className={`md:w-82 flex-shrink-0 ${mobileView !== 'list' ? 'hidden md:block' : ''}`}>
                    <ContactList />
                </div>
                <div className={`flex-1 ${mobileView === 'list' ? 'hidden md:block' : ''} ${(!selectedContact && !isCreating) ? 'hidden' : ''}`}>
                    <ContactDetails />
                </div>
            </div></>
    )
}

export default App
