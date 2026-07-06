import { useState, useRef } from 'react';
import { Upload, X, Image, Loader2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProductImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  productSlug?: string;
}

export function ProductImageUploader({ 
  images, 
  onImagesChange, 
  productSlug = 'product' 
}: ProductImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Type de fichier invalide',
            description: `${file.name} n'est pas une image`,
            variant: 'destructive',
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'Fichier trop volumineux',
            description: `${file.name} dépasse la limite de 5MB`,
            variant: 'destructive',
          });
          continue;
        }

        const timestamp = Date.now();
        const sanitizedSlug = productSlug.replace(/[^a-zA-Z0-9-]/g, '-');
        const extension = file.name.split('.').pop() || 'jpg';
        const fileName = `${sanitizedSlug}/${timestamp}-${i}.${extension}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: 'Erreur d\'upload',
            description: error.message,
            variant: 'destructive',
          });
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        newImages.push(urlData.publicUrl);
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
        toast({
          title: 'Images uploadées',
          description: `${newImages.length} image(s) ajoutée(s)`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'uploader les images',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    
    // Try to delete from storage if it's a Supabase URL
    if (imageUrl.includes('product-images')) {
      try {
        const urlParts = imageUrl.split('product-images/');
        if (urlParts[1]) {
          await supabase.storage
            .from('product-images')
            .remove([urlParts[1]]);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [movedImage] = newImages.splice(index, 1);
    newImages.unshift(movedImage);
    onImagesChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const [movedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, movedImage);
    onImagesChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Images du produit
        </label>
        <span className="text-xs text-muted-foreground">
          {images.length} image(s) • Glissez pour réorganiser
        </span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative group aspect-square bg-secondary rounded-md overflow-hidden border-2 transition-all ${
              index === 0 ? 'border-primary' : 'border-transparent'
            } ${draggedIndex === index ? 'opacity-50' : ''}`}
          >
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Main image badge */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider px-2 py-1">
                Principale
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <div className="cursor-grab">
                <GripVertical className="w-5 h-5 text-background" />
              </div>
              {index !== 0 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleSetMainImage(index)}
                  className="text-xs"
                >
                  Principale
                </Button>
              )}
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleRemoveImage(index)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="aspect-square bg-secondary/50 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-2 hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Ajouter</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        Formats acceptés : JPG, PNG, WebP • Taille max : 5MB par image
      </p>
    </div>
  );
}
