import React, { useState } from 'react';

interface AudioUploaderProps {
  onUploadSuccess: (url: string) => void;
  onUploadError: (error: string) => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ 
  onUploadSuccess, 
  onUploadError 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      onUploadError('Please select an audio file (MP3, WAV, etc.)');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      onUploadError('File size must be less than 50MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUploadSuccess(data.url);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError('Failed to upload audio file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-spotify-gray-800 border border-spotify-gray-600 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-spotify-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium">Upload Audio File</h4>
          <p className="text-spotify-gray-300 text-sm">
            Upload an MP3 or WAV file to add audio to this song
          </p>
          
          <div className="mt-3">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              <div className="bg-spotify-green text-black px-4 py-2 rounded-md hover:bg-green-400 transition-colors disabled:opacity-50">
                {isUploading ? 'Uploading...' : 'Choose Audio File'}
              </div>
            </label>
          </div>

          {isUploading && (
            <div className="mt-3">
              <div className="w-full bg-spotify-gray-600 rounded-full h-2">
                <div 
                  className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 