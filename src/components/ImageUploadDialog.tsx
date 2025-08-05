import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadDialogProps {
  children: React.ReactNode;
  onUploadComplete?: (imageUrl: string) => void;
}

export default function ImageUploadDialog({ children, onUploadComplete }: ImageUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [avatarName, setAvatarName] = useState("");
  const [description, setDescription] = useState("");
  const { uploadAvatar, uploading } = useAvatarUpload();
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !avatarName.trim()) return;

    const imageUrl = await uploadAvatar(selectedFile, avatarName);
    
    if (imageUrl) {
      onUploadComplete?.(imageUrl);
      setOpen(false);
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl("");
      setAvatarName("");
      setDescription("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Avatar Image
          </DialogTitle>
          <DialogDescription>
            Upload a photo to create a custom avatar for your videos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="image-upload">Select Image</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              {previewUrl ? (
                <div className="space-y-2">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Click to select an image</p>
                </div>
              )}
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-2"
              />
            </div>
          </div>

          {/* Avatar Name */}
          <div className="space-y-2">
            <Label htmlFor="avatar-name">Avatar Name</Label>
            <Input
              id="avatar-name"
              placeholder="Enter a name for your avatar"
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your avatar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              Upload your photo to create a custom avatar. This will be saved to your profile and can be used for generating agents.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !avatarName.trim() || uploading}
            className="gap-2"
          >
            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
            Upload Avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}