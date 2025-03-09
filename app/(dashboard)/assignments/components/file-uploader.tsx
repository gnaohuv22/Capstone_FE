"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, File, Upload, X } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

interface FileWithPreview extends File {
  preview?: string;
}

export function FileUploader() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    ));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeFile = (index: number) => {
    setFiles(files => {
      const newFiles = [...files];
      URL.revokeObjectURL(newFiles[index].preview || "");
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Implement file upload logic
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload
    setIsSubmitting(false);
    setFiles([]);
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onDrop([file]);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      {/* Khu vực kéo thả */}
      <Card
        {...getRootProps()}
        className={`p-8 border-2 border-dashed cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Kéo thả file vào đây hoặc click để chọn file
            </p>
            <p className="text-sm text-muted-foreground">
              Hỗ trợ ảnh (PNG, JPG) và PDF. Tối đa 5 file, mỗi file không quá 5MB
            </p>
          </div>
        </div>
      </Card>

      {/* Nút chụp ảnh */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleCameraCapture}
      >
        <Camera className="mr-2 h-4 w-4" />
        Chụp ảnh bài làm
      </Button>

      {/* Xem trước file */}
      {files.length > 0 && (
        <Card className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file, index) => (
              <div key={file.name} className="relative group">
                {file.type.startsWith('image/') ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={file.preview || ""}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                    <File className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <p className="mt-1 text-xs text-muted-foreground truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Nút nộp bài */}
      {files.length > 0 && (
        <Button 
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang nộp bài..." : "Nộp bài"}
        </Button>
      )}
    </div>
  );
} 