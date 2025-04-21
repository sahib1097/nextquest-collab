
import React, { useState, useRef, ReactNode } from 'react';
import { toast } from 'sonner';

interface ProfilePictureUploaderProps {
  onUpload: (imageUrl: string) => void;
  children: ReactNode;
}

export const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ 
  onUpload,
  children 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    // Create a FileReader to read the file as a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      // In a real app, you would upload this to your server/storage
      // and get back a permanent URL, but for now we'll use the data URL
      setTimeout(() => {
        onUpload(imageUrl);
        setIsUploading(false);
      }, 800); // Simulate upload delay
    };
    
    reader.onerror = () => {
      toast.error("Error reading file");
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div onClick={handleClick} className={isUploading ? 'cursor-wait' : 'cursor-pointer'}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      {children}
    </div>
  );
};
