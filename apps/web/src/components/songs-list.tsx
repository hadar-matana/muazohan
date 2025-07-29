
import { useEffect, useState } from 'react';
import { Song } from '../types';
import { mockSongs } from '../songs';
import { SongItem } from './song-item';

export default function SongList() {
//   const [songs, setSongs] = useState<Song[]>([]);
  const fetchedSongs = mockSongs

  console.log(mockSongs)

  return (   
         <div className="song-list-content">
          {fetchedSongs.map((song, index) => (
            <SongItem
              key={song.id}
              song={song}
              onPlayPause={() => {}}
            />
          ))}
        </div>
  );
}