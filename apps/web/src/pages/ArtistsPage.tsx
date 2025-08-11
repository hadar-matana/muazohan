
import { useNavigate } from 'react-router-dom';
import ArtistsList from '../components/artists-list';
import { Artist } from '../data/types';

export default function ArtistsPage() {
  const navigate = useNavigate();

  const handleArtistClick = (artist: Artist) => {
    navigate(`/artists/${artist.id}`);
  };

  return <ArtistsList onArtistClick={handleArtistClick} />;
} 