import React, { useState } from 'react';
import { AudioUploader } from './AudioUploader';

interface AudioUnavailableMessageProps {
  songTitle: string;
  artistName: string;
  onAudioUploaded?: (url: string) => void;
}

export const AudioUnavailableMessage: React.FC<AudioUnavailableMessageProps> = ({ 
  songTitle, 
  artistName,
  onAudioUploaded
}) => {
  const [showUploader, setShowUploader] = useState(false);

  const handleUploadSuccess = (url: string) => {
    console.log('Audio uploaded successfully:', url);
    onAudioUploaded?.(url);
    setShowUploader(false);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // You could show a toast notification here
  };

  return (
    <div className="bg-spotify-gray-800 border border-spotify-gray-600 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-spotify-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium">Audio Unavailable</h4>
          <p className="text-spotify-gray-300 text-sm">
            Audio file not available for "{songTitle}" by {artistName}
          </p>
          <p className="text-spotify-gray-400 text-xs mt-1">
            This song is available for preview but audio playback is not currently supported.
          </p>
          
          {onAudioUploaded && (
            <div className="mt-3">
              {!showUploader ? (
                <button
                  onClick={() => setShowUploader(true)}
                  className="bg-spotify-green text-black px-3 py-1 rounded text-sm hover:bg-green-400 transition-colors"
                >
                  Upload Audio
                </button>
              ) : (
                <AudioUploader
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 