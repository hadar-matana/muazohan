import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArtistDetail from '../components/artist-detail';
import { Album } from '../data/types';

export default function ArtistDetailPage() {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();

  if (!artistId) {
    return <div>Artist not found</div>;
  }

  const handleAlbumClick = (album: Album) => {
    navigate(`/albums/${album.id}`);
  };

  const handleBack = () => {
    navigate('/artists');
  };

  return (
    <ArtistDetail
      artistId={artistId}
      onAlbumClick={handleAlbumClick}
      onBack={handleBack}
    />
  );
} 