import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Upload, Trash2 } from 'lucide-react';
import { useAvatarUpload, UploadedAvatar } from '@/hooks/useAvatarUpload';
import ImageUploadDialog from './ImageUploadDialog';

interface UserAvatarSelectorProps {
  onAvatarSelect?: (avatarUrl: string) => void;
  selectedAvatarUrl?: string;
  showUploadButton?: boolean;
}

export default function UserAvatarSelector({ 
  onAvatarSelect, 
  selectedAvatarUrl, 
  showUploadButton = true 
}: UserAvatarSelectorProps) {
  const [userAvatars, setUserAvatars] = useState<UploadedAvatar[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUserAvatars, deleteAvatar } = useAvatarUpload();

  const loadUserAvatars = async () => {
    setLoading(true);
    const avatars = await getUserAvatars();
    setUserAvatars(avatars);
    setLoading(false);
  };

  useEffect(() => {
    loadUserAvatars();
  }, []);

  const handleAvatarSelect = (avatar: UploadedAvatar) => {
    onAvatarSelect?.(avatar.imageUrl);
  };

  const handleDeleteAvatar = async (fileName: string, avatarId: string) => {
    const success = await deleteAvatar(fileName);
    if (success) {
      setUserAvatars(prev => prev.filter(avatar => avatar.id !== avatarId));
    }
  };

  const handleUploadComplete = (imageUrl: string) => {
    loadUserAvatars(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Your Avatars</h3>
          <Badge variant="outline">{userAvatars.length}</Badge>
        </div>
        
        {showUploadButton && (
          <ImageUploadDialog onUploadComplete={handleUploadComplete}>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload New
            </Button>
          </ImageUploadDialog>
        )}
      </div>

      {userAvatars.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">No Custom Avatars Yet</h4>
            <p className="text-muted-foreground mb-4">
              Upload your photos to create personalized avatars for your videos.
            </p>
            {showUploadButton && (
              <ImageUploadDialog onUploadComplete={handleUploadComplete}>
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Your First Avatar
                </Button>
              </ImageUploadDialog>
            )}
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-80">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pr-4">
            {userAvatars.map((avatar) => (
              <Card 
                key={avatar.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg group ${
                  selectedAvatarUrl === avatar.imageUrl ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleAvatarSelect(avatar)}
              >
                <CardContent className="p-0 relative">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    
                    {/* Selected indicator */}
                    {selectedAvatarUrl === avatar.imageUrl && (
                      <div className="absolute inset-0 bg-primary/20 rounded-t-lg flex items-center justify-center">
                        <Badge className="bg-primary text-white">Selected</Badge>
                      </div>
                    )}

                    {/* Delete button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileName = avatar.imageUrl.split('/').pop();
                        if (fileName) {
                          handleDeleteAvatar(fileName, avatar.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="p-3">
                    <p className="text-sm font-medium text-center truncate">
                      {avatar.name}
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      {new Date(avatar.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}