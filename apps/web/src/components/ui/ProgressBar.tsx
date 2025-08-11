import React, { useState, useRef, useCallback } from 'react';
import type { ProgressBarProps } from '../../data/types';

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentTime, 
  duration, 
  onSeek 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayProgress = isDragging && dragTime !== null 
    ? (dragTime / duration) * 100 
    : progress;

  const calculateTimeFromPosition = useCallback((clientX: number) => {
    if (!progressBarRef.current) return 0;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    return Math.max(0, Math.min(percentage * duration, duration));
  }, [duration]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    const newTime = calculateTimeFromPosition(event.clientX);
    setDragTime(newTime);
    onSeek(newTime);
  };

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging) return;
    
    const newTime = calculateTimeFromPosition(event.clientX);
    setDragTime(newTime);
    onSeek(newTime);
  }, [isDragging, calculateTimeFromPosition, onSeek]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragTime(null);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return; // Don't handle click if we're dragging
    const newTime = calculateTimeFromPosition(event.clientX);
    onSeek(newTime);
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    const touch = event.touches[0];
    const newTime = calculateTimeFromPosition(touch.clientX);
    setDragTime(newTime);
    onSeek(newTime);
  };

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isDragging) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const newTime = calculateTimeFromPosition(touch.clientX);
    setDragTime(newTime);
    onSeek(newTime);
  }, [isDragging, calculateTimeFromPosition, onSeek]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setDragTime(null);
  }, []);

  // Add/remove global event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div 
      ref={progressBarRef}
      className={`w-full h-2 bg-dark-700 rounded-full cursor-pointer hover:bg-dark-600 transition-colors duration-200 group ${
        isDragging ? 'select-none' : ''
      }`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ userSelect: isDragging ? 'none' : 'auto' }}
    >
      <div 
        className={`h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300 shadow-sm group-hover:shadow-glow ${
          isDragging ? 'transition-none' : ''
        }`}
        style={{ width: `${displayProgress}%` }}
      />
    </div>
  );
};
