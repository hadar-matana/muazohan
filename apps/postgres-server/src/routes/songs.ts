import express from 'express';
import { DatabaseService } from '../services/DatabaseService';

const router: express.Router = express.Router();
const dbService = new DatabaseService();

// Get all songs
router.get('/', async (req, res) => {
  try {
    const songs = await dbService.getAllSongs();
    res.json({ success: true, data: songs });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Get song by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid song ID' });
    }

    const song = await dbService.getSongById(id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json({ success: true, data: song });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

// Create new song
router.post('/', async (req, res) => {
  try {
    const { title, duration, url, artistId, albumId } = req.body;

    if (!title || !duration || !url) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, duration, url' 
      });
    }

    const song = await dbService.createSong({
      title,
      duration: parseInt(duration),
      url,
      artistId: artistId ? parseInt(artistId) : undefined,
      albumId: albumId ? parseInt(albumId) : undefined,
    });

    res.status(201).json({ success: true, data: song });
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ error: 'Failed to create song' });
  }
});

// Update song
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid song ID' });
    }

    const song = await dbService.updateSong(id, req.body);
    res.json({ success: true, data: song });
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ error: 'Failed to update song' });
  }
});

// Delete song
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid song ID' });
    }

    await dbService.deleteSong(id);
    res.json({ success: true, message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

// Search songs
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const songs = await dbService.searchSongs(query);
    res.json({ success: true, data: songs });
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ error: 'Failed to search songs' });
  }
});

export default router;
