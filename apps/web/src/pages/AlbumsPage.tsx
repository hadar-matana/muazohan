
import { useNavigate } from 'react-router-dom';
import AlbumsList from '../components/albums-list';
import { Album } from '../data/types';

export default function AlbumsPage() {
  const navigate = useNavigate();

  const handleAlbumClick = (album: Album) => {
    navigate(`/albums/${album.id}`);
  };

  return <AlbumsList onAlbumClick={handleAlbumClick} />;
} 