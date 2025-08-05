import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
    full: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  width: number;
  height: number;
}

interface UnsplashImageSearchProps {
  onImageSelect?: (imageUrl: string, alt: string) => void;
  orientation?: "landscape" | "portrait" | "squarish";
}

export const UnsplashImageSearch = ({ onImageSelect, orientation }: UnsplashImageSearchProps) => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrientation, setSelectedOrientation] = useState<string>(orientation || "");

  const searchImages = async (searchQuery: string, pageNum = 1, reset = true) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('unsplash-search', {
        body: {
          query: searchQuery,
          page: pageNum,
          per_page: 20,
          ...(selectedOrientation && { orientation: selectedOrientation })
        }
      });

      if (error) throw error;

      if (reset) {
        setImages(data.images);
      } else {
        setImages(prev => [...prev, ...data.images]);
      }
      
      setTotalPages(data.total_pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error searching images:', error);
      toast.error('Failed to search images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchImages(query, 1, true);
  };

  const loadMore = () => {
    if (page < totalPages) {
      searchImages(query, page + 1, false);
    }
  };

  const handleImageSelect = (image: UnsplashImage) => {
    if (onImageSelect) {
      onImageSelect(image.urls.regular, image.alt_description);
      toast.success('Image selected successfully!');
    } else {
      // Default behavior: copy URL to clipboard
      navigator.clipboard.writeText(image.urls.regular);
      toast.success('Image URL copied to clipboard!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search for images (e.g., business, nature, technology...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Select value={selectedOrientation} onValueChange={setSelectedOrientation}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Orientation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="landscape">Landscape</SelectItem>
            <SelectItem value="portrait">Portrait</SelectItem>
            <SelectItem value="squarish">Square</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={handleSearch} disabled={loading || !query.trim()}>
          <Search className="w-4 h-4 mr-2" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {images.length > 0 && (
        <ScrollArea className="h-96">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card 
                key={image.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleImageSelect(image)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={image.urls.small}
                      alt={image.alt_description}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="w-3 h-3 mr-1" />
                      <span>{image.user.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {image.width} × {image.height}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {page < totalPages && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={loadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </ScrollArea>
      )}

      {images.length === 0 && !loading && query && (
        <div className="text-center py-8 text-muted-foreground">
          No images found. Try a different search term.
        </div>
      )}
    </div>
  );
};