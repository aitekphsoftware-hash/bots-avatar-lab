import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UploadedAvatar {
  id: string;
  name: string;
  imageUrl: string;
  uploadedAt: string;
}

export const useAvatarUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (file: File, name: string): Promise<string | null> => {
    try {
      setUploading(true);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${name.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Avatar uploaded successfully!",
      });

      return publicUrl;

    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const getUserAvatars = async (): Promise<UploadedAvatar[]> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return [];
      }

      // List all files in user's folder
      const { data: files, error: listError } = await supabase.storage
        .from('avatars')
        .list(user.id, {
          limit: 20,
          offset: 0
        });

      if (listError) {
        throw listError;
      }

      // Convert to UploadedAvatar format
      const avatars: UploadedAvatar[] = files?.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${user.id}/${file.name}`);

        return {
          id: file.id || file.name,
          name: file.name.split('_')[0].replace(/[_-]/g, ' '),
          imageUrl: publicUrl,
          uploadedAt: file.created_at || file.updated_at || new Date().toISOString()
        };
      }) || [];

      return avatars;

    } catch (error) {
      console.error('Error fetching user avatars:', error);
      return [];
    }
  };

  const deleteAvatar = async (fileName: string): Promise<boolean> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return false;
      }

      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([`${user.id}/${fileName}`]);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: "Success",
        description: "Avatar deleted successfully",
      });

      return true;

    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete avatar",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadAvatar,
    getUserAvatars,
    deleteAvatar,
    uploading
  };
};