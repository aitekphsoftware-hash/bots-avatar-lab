import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/lib/d-id-api";

interface AvatarCardProps {
  avatar: Avatar;
  onSelect?: (avatar: Avatar) => void;
  isSelected?: boolean;
  showCreateButton?: boolean;
}

export default function AvatarCard({ avatar, onSelect, isSelected, showCreateButton }: AvatarCardProps) {
  return (
    <div 
      className={`relative group cursor-pointer border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect?.(avatar)}
    >
      <div className="aspect-[3/4] relative">
        <img
          src={avatar.image_url}
          alt={avatar.name}
          className="w-full h-full object-cover"
        />
        
        {/* Premium badge */}
        {avatar.style === 'premium' && (
          <Badge className="absolute top-2 left-2 bg-black/80 text-white text-xs">
            Premium
          </Badge>
        )}
        
        {/* New badge for newer avatars */}
        <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
          New
        </Badge>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          {showCreateButton && (
            <Button variant="default" size="sm">
              Select Avatar
            </Button>
          )}
        </div>
      </div>
      
      {/* Avatar info */}
      <div className="p-3">
        <p className="text-sm font-medium text-center">{avatar.name}</p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {avatar.id}
        </p>
      </div>
    </div>
  );
}