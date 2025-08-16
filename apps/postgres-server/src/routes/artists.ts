import express from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { 
  validateArtistCreate, 
  validateArtistUpdate, 
  validateIdParam 
} from '../validations';

const router: express.Router = express.Router();
const dbService = new DatabaseService();

// Get all artists
router.get('/', async (req, res) => {
  try {
    const artists = await dbService.getAllArtists();
    res.json({ success: true, data: artists });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

// Get artist by ID
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const id = req.params.id;

    const artist = await dbService.getArtistById(id);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    res.json({ success: true, data: artist });
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({ error: 'Failed to fetch artist' });
  }
});

// Create new artist
router.post('/', validateArtistCreate, async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    const artist = await dbService.createArtist({ name, imageUrl });
    res.status(201).json({ success: true, data: artist });
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({ error: 'Failed to create artist' });
  }
});

// Update artist
router.put('/:id', validateIdParam, validateArtistUpdate, async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const artist = await dbService.updateArtist(id, updateData);
    res.json({ success: true, data: artist });
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({ error: 'Failed to update artist' });
  }
});

// Delete artist
router.delete('/:id', validateIdParam, async (req, res) => {
  try {
    const id = req.params.id;

    await dbService.deleteArtist(id);
    res.json({ success: true, message: 'Artist deleted successfully' });
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ error: 'Failed to delete artist' });
  }
});

export default router;
