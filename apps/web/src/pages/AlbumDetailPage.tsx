
import { useParams, useNavigate } from 'react-router-dom';
import AlbumDetail from '../components/album-detail';
import { Song } from '../data/types';
import { usePlayer } from '../hooks/usePlayer';

export default function AlbumDetailPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const { playSong } = usePlayer();

  if (!albumId) {
    return <div>Album not found</div>;
  }

  const handleSongClick = (song: Song) => {
    playSong(song);
  };

  const handleBack = () => {
    navigate('/albums');
  };

  return (
    <AlbumDetail
      albumId={albumId}
      onSongClick={handleSongClick}
      onBack={handleBack}
    />
  );
} 