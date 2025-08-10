import express from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { 
  validateSongCreate, 
  validateSongUpdate, 
  validatePagination, 
  validateIdParam, 
  validateSearchQuery 
} from '../middleware/validation';

const router: express.Router = express.Router();
const dbService = new DatabaseService();

// Get all songs with pagination
router.get('/', validatePagination, async (req, res) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    
    const result = await dbService.getAllSongs({ page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Get song by ID
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const id = req.params.id;

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
router.post('/', validateSongCreate, async (req, res) => {
  try {
    const { title, duration, mp3Url, artistId, albumId } = req.body;

    const song = await dbService.createSong({
      title,
      duration,
      mp3Url,
      artistId,
      albumId,
    });

    res.status(201).json({ success: true, data: song });
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ error: 'Failed to create song' });
  }
});

// Update song
router.put('/:id', validateIdParam, validateSongUpdate, async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const song = await dbService.updateSong(id, updateData);
    res.json({ success: true, data: song });
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ error: 'Failed to update song' });
  }
});

// Delete song
router.delete('/:id', validateIdParam, async (req, res) => {
  try {
    const id = req.params.id;

    await dbService.deleteSong(id);
    res.json({ success: true, message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

// Search songs with pagination
router.get('/search/:query', validateSearchQuery, validatePagination, async (req, res) => {
  try {
    const { query } = req.params;
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    
    const result = await dbService.searchSongs(query, { page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ error: 'Failed to search songs' });
  }
});

export default router;
