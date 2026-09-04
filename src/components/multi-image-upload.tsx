"use client";

import { useState, useRef } from "react";

interface MultiImageUploadProps {
  onUpload: (urls: string[]) => void;
  defaultValues?: string[];
  label?: string;
}

export function MultiImageUpload({ onUpload, defaultValues = [], label = "Upload Images" }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(defaultValues);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    const newUrls = [...imageUrls];

    try {
      // Upload files sequentially to avoid rate limits
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          body: file,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const blob = await response.json();
        newUrls.push(blob.url);
      }

      setImageUrls(newUrls);
      onUpload(newUrls);
    } catch (error) {
      console.error(error);
      alert("Error uploading images");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newUrls = imageUrls.filter((_, idx) => idx !== indexToRemove);
    setImageUrls(newUrls);
    onUpload(newUrls);
  };

  return (
    <div className="space-y-4">
      <label className="block text-[13px] font-bold">{label}</label>
      
      {imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="relative w-24 h-24 border border-line bg-cream overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
              <button 
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-ink text-paper w-5 h-5 rounded-full flex items-center justify-center text-[8px]"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputFileRef.current?.click()}
          disabled={isUploading}
          className="press border border-line bg-cream px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] hover:border-brand transition-colors disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Add Images"}
        </button>
        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}