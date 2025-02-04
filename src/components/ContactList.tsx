import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAtom } from "jotai";
import { useCallback } from 'react';
import { Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { useContacts } from '@/hooks/useContacts';
import { searchQueryAtom, filterLetterAtom, selectedContactAtom, isCreatingAtom, mobileViewAtom } from "@/state/atom";
import { Contact } from "@/models/schema";
import { Avatar, AvatarImage } from "./ui/avatar";

const ContactList = () => {
    const { contacts, isLoading, error, updateContact } = useContacts();
    const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
    const [filterLetter, setFilterLetter] = useAtom(filterLetterAtom);
    const [, setSelectedContact] = useAtom(selectedContactAtom);
    const [, setIsCreating] = useAtom(isCreatingAtom);
    const [, setMobileView] = useAtom(mobileViewAtom);

    const handleBookmarkToggle = useCallback((e: React.MouseEvent, contact: Contact) => {
        e.stopPropagation();
        updateContact({
            id: contact.id,
            contact: {
                bookmarked: !contact.bookmarked
            }
        });
    }, [updateContact]);

    const handleContactSelect = (contact: Contact) => {
        setSelectedContact(contact);
        setIsCreating(false);
        setMobileView('details');
    };

    const sortedAndFilteredContacts = contacts
        .sort((a, b) => {
            if (a.bookmarked !== b.bookmarked) {
                return a.bookmarked ? -1 : 1;
            }
            return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        })
        .filter((contact) =>
            contact.name.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
            (!filterLetter || contact.name.toLowerCase().startsWith(filterLetter))
        );

    const bookmarkedContacts = sortedAndFilteredContacts.filter(contact => contact.bookmarked);
    const normalContacts = sortedAndFilteredContacts.filter(contact => !contact.bookmarked);

    // Get available first letters from all contacts
    const availableLetters = [...new Set(contacts.map(contact =>
        contact.name.charAt(0).toUpperCase()
    ))].sort();


    const getRandomImage = (name: string) => `https://robohash.org/${name}`;


    if (isLoading) {
        return (
            <main className="md:col-span-2 lg:col-span-5 min-w-[400px] bg-white rounded-lg shadow-lg h-[calc(100vh-2rem)] flex flex-col">
                <Card className="border-0 h-full flex flex-col">
                    <CardHeader className="border-b bg-gray-50/50 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-semibold">Contacts</CardTitle>
                            <div className="md:hidden">
                                <Button variant="ghost" size="sm">+ New</Button>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-auto">
                        <ul className="divide-y divide-gray-100">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <li key={index} className="p-4 flex items-center gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 min-w-0">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-1/2 mt-2" />
                                    </div>
                                    <Skeleton className="h-6 w-6" />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </main>
        );
    }

    if (error) return <div>Error: {error.message}</div>;

    return (
        <main className="md:col-span-2 lg:col-span-5 bg-white rounded-lg shadow-lg h-[calc(100vh-2rem)]">
            <Card className="border-0 h-full flex flex-col">
                <CardHeader className="border-b bg-gray-50/50 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">Contacts</CardTitle>
                        <div className="md:hidden">
                            <Button variant="ghost" size="sm" onClick={() => { setIsCreating(true); setMobileView('create'); }}>
                                + New
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="w-10">
                                    {filterLetter ? filterLetter.toUpperCase() : <Filter className="h-4 w-4" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <div className="grid grid-cols-5 gap-1 p-2">
                                    {availableLetters.map(letter => (
                                        <DropdownMenuItem
                                            key={letter}
                                            onClick={() => setFilterLetter(letter.toLowerCase())}
                                            className={`justify-center font-medium hover:bg-accent hover:text-accent-foreground ${filterLetter === letter.toLowerCase() ? 'bg-accent text-accent-foreground' : ''
                                                }`}
                                        >
                                            {letter}
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                                {filterLetter && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => setFilterLetter(null)}
                                            className="justify-center font-medium"
                                        >
                                            Clear filter
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-auto">
                    <ul className="divide-y divide-gray-100">
                        {bookmarkedContacts.map((contact) => (
                            <li
                                key={contact.id}
                                className="p-4 cursor-pointer hover:bg-blue-50/50 transition-colors flex items-center gap-4 bg-blue-50/30"
                                onClick={() => handleContactSelect(contact)}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={getRandomImage(contact.name)} alt={contact.name} />
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                                    {contact.phone && <p className="text-sm text-gray-500 truncate">{contact.phone}</p>}
                                </div>
                                <button
                                    onClick={(e) => handleBookmarkToggle(e, contact)}
                                    className="text-blue-500 hover:text-blue-700 p-2"
                                >
                                    ★
                                </button>
                            </li>
                        ))}

                        {bookmarkedContacts.length > 0 && normalContacts.length > 0 && (
                            <li className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50/50 uppercase tracking-wider">
                                Other Contacts
                            </li>
                        )}

                        {normalContacts.map((contact) => (
                            <li
                                key={contact.id}
                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-4"
                                onClick={() => handleContactSelect(contact)}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={getRandomImage(contact.name)} alt={contact.name} />
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                                    {contact.phone && <p className="text-sm text-gray-500 truncate">{contact.phone}</p>}
                                </div>
                                <button
                                    onClick={(e) => handleBookmarkToggle(e, contact)}
                                    className="text-gray-300 hover:text-blue-500 p-2"
                                >
                                    ★
                                </button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </main>
    );
};

export default ContactList;