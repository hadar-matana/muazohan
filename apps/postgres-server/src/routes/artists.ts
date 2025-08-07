import express from 'express';
import { DatabaseService } from '../services/DatabaseService';

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
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid artist ID' });
    }

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
router.post('/', async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name) {
      return res.status(400).json({ 
        error: 'Missing required field: name' 
      });
    }

    const artist = await dbService.createArtist({ name, bio });
    res.status(201).json({ success: true, data: artist });
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({ error: 'Failed to create artist' });
  }
});

// Update artist
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid artist ID' });
    }

    const artist = await dbService.updateArtist(id, req.body);
    res.json({ success: true, data: artist });
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({ error: 'Failed to update artist' });
  }
});

// Delete artist
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid artist ID' });
    }

    await dbService.deleteArtist(id);
    res.json({ success: true, message: 'Artist deleted successfully' });
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ error: 'Failed to delete artist' });
  }
});

export default router;
