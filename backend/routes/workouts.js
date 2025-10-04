const express = require('express');
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

const router = express.Router();

// Get all workouts for user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new workout
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, duration, exercises, notes, caloriesBurned } = req.body;

    // Validate required fields
    if (!name || !type || !duration || !exercises) {
      return res.status(400).json({ 
        message: 'Name, type, duration, and exercises are required' 
      });
    }

    const workout = new Workout({
      name,
      type,
      duration: parseInt(duration),
      exercises: exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets ? parseInt(exercise.sets) : 0,
        reps: exercise.reps ? parseInt(exercise.reps) : 0,
        weight: exercise.weight ? parseInt(exercise.weight) : 0,
        duration: exercise.duration ? parseInt(exercise.duration) : 0
      })),
      notes: notes || '',
      caloriesBurned: caloriesBurned ? parseInt(caloriesBurned) : 0,
      userId: req.user.id
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ 
      message: 'Error creating workout',
      error: error.message 
    });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json(workout);
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;