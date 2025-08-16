import express from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { 
  validateAlbumCreate, 
  validateAlbumUpdate, 
  validateIdParam 
} from '../validations/middleware';

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
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const id = req.params.id;

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
router.post('/', validateAlbumCreate, async (req, res) => {
  try {
    const { name, year, artistId, imageUrl } = req.body;

    const album = await dbService.createAlbum({
      name,
      year: year ? parseInt(year) : undefined,
      artistId,
      imageUrl,
    });

    res.status(201).json({ success: true, data: album });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Failed to create album' });
  }
});

// Update album
router.put('/:id', validateIdParam, validateAlbumUpdate, async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const album = await dbService.updateAlbum(id, updateData);
    res.json({ success: true, data: album });
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ error: 'Failed to update album' });
  }
});

// Delete album
router.delete('/:id', validateIdParam, async (req, res) => {
  try {
    const id = req.params.id;

    await dbService.deleteAlbum(id);
    res.json({ success: true, message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

export default router;
