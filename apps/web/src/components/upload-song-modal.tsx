import React, { useState, useRef } from 'react';
import { trpc } from '../trpc';
import type { Artist, Album } from '../data/types';

interface UploadSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Simple button component to avoid import issues
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}> = ({ children, onClick, variant = 'primary', disabled = false, type = 'button', className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm rounded-xl';
  
  const variantStyles = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-soft hover:shadow-glow active:scale-95 disabled:hover:shadow-soft disabled:active:scale-100',
    secondary: 'bg-dark-700 hover:bg-dark-600 text-white border border-dark-600 hover:border-dark-500 shadow-soft disabled:hover:bg-dark-700',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export function UploadSongModal({ isOpen, onClose, onSuccess }: UploadSongModalProps) {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [artistId, setArtistId] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: artists } = trpc.getArtists.useQuery();
  const { data: albums } = trpc.getAlbums.useQuery();
  const uploadSongMutation = trpc.uploadSong.useMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        setError('Please select an audio file');
        return;
      }
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      
      // Auto-fill title from filename if title is empty
      if (!title) {
        const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
        setTitle(fileName);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an audio file');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a song title');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      // Convert file to base64
      const base64Data = await fileToBase64(selectedFile);
      
      await uploadSongMutation.mutateAsync({
        fileData: base64Data,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        title: title.trim(),
        artistId: artistId || undefined,
        albumId: albumId || undefined,
      });
      
      // Reset form
      setTitle('');
      setSelectedFile(null);
      setArtistId('');
      setAlbumId('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload song');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleClose = () => {
    if (!isUploading) {
      setTitle('');
      setSelectedFile(null);
      setArtistId('');
      setAlbumId('');
      setError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-light-200/50 dark:border-dark-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-light-200/50 dark:border-dark-700/50">
          <h2 className="text-xl font-semibold text-light-950 dark:text-white">
            Upload New Song
          </h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 rounded-xl text-light-500 hover:text-light-700 dark:text-dark-400 dark:hover:text-dark-200 hover:bg-light-100 dark:hover:bg-dark-700 transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-light-700 dark:text-dark-300">
              Audio File *
            </label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full p-4 border-2 border-dashed border-light-300 dark:border-dark-600 rounded-xl text-light-500 dark:text-dark-400 hover:border-orange-400 dark:hover:border-orange-400 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-200 disabled:opacity-50"
              >
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm">
                    {selectedFile ? selectedFile.name : 'Click to select audio file'}
                  </span>
                  <span className="text-xs opacity-75">
                    MP3, WAV, OGG, M4A, AAC (max 50MB)
                  </span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-light-700 dark:text-dark-300">
              Song Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              placeholder="Enter song title"
              className="w-full px-4 py-3 bg-light-50 dark:bg-dark-700 border border-light-200 dark:border-dark-600 rounded-xl text-light-950 dark:text-white placeholder-light-500 dark:placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            />
          </div>
          
          {/* Artist Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-light-700 dark:text-dark-300">
              Artist (Optional)
            </label>
            <select
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
              disabled={isUploading}
              className="w-full px-4 py-3 bg-light-50 dark:bg-dark-700 border border-light-200 dark:border-dark-600 rounded-xl text-light-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            >
              <option value="">Select an artist</option>
              {artists?.map((artist: Artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Album Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-light-700 dark:text-dark-300">
              Album (Optional)
            </label>
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              disabled={isUploading}
              className="w-full px-4 py-3 bg-light-50 dark:bg-dark-700 border border-light-200 dark:border-dark-600 rounded-xl text-light-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            >
              <option value="">Select an album</option>
              {albums?.map((album: Album) => (
                <option key={album.id} value={album.id}>
                  {album.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isUploading || !selectedFile || !title.trim()}
              className="flex-1"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                'Upload Song'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
