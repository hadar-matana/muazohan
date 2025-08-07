import express from 'express';
import { DatabaseService } from '../services/DatabaseService';

const router: express.Router = express.Router();
const dbService = new DatabaseService();

// Get all albums
router.get('/', async (req, res) => {
  try {
    const albums = await dbService.getAllAlbums();
    res.json({ success: true, data: albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// Get album by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid album ID' });
    }

    const album = await dbService.getAlbumById(id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json({ success: true, data: album });
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Failed to fetch album' });
  }
});

// Create new album
router.post('/', async (req, res) => {
  try {
    const { title, releaseDate, artistId } = req.body;

    if (!title || !releaseDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, releaseDate' 
      });
    }

    const album = await dbService.createAlbum({
      title,
      releaseDate: new Date(releaseDate),
      artistId: artistId ? parseInt(artistId) : undefined,
    });

    res.status(201).json({ success: true, data: album });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Failed to create album' });
  }
});

// Update album
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid album ID' });
    }

    const album = await dbService.updateAlbum(id, req.body);
    res.json({ success: true, data: album });
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ error: 'Failed to update album' });
  }
});

// Delete album
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid album ID' });
    }

    await dbService.deleteAlbum(id);
    res.json({ success: true, message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

export default router;
