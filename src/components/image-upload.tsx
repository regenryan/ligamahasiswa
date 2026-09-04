"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultValue?: string;
  label?: string;
}

export function ImageUpload({ onUpload, defaultValue, label = "Upload Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(defaultValue || "");
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const blob = await response.json();
      setImageUrl(blob.url);
      onUpload(blob.url);
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-bold">{label}</label>
      
      {imageUrl && (
        <div className="mb-4 relative w-32 h-32 border border-line bg-cream overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Uploaded preview" className="object-cover w-full h-full" />
          <button 
            type="button"
            onClick={() => { setImageUrl(""); onUpload(""); }}
            className="absolute top-1 right-1 bg-ink text-paper w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
          >
            X
          </button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputFileRef.current?.click()}
          disabled={isUploading}
          className="press border border-line bg-cream px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] hover:border-brand transition-colors disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Choose File"}
        </button>
        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}