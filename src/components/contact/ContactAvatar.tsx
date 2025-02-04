import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ContactAvatarProps {
  name: string;
  size?: "sm" | "lg";
}

export const ContactAvatar = ({ name, size = "lg" }: ContactAvatarProps) => {
  const getRandomImage = (name: string) => `https://robohash.org/${name}`;
  const sizeClass = size === "lg" ? "h-24 w-24" : "h-8 w-8";

  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={getRandomImage(name)} alt={name} />
    </Avatar>
  );
}; 