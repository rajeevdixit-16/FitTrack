const express = require('express');
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const Goal = require('../models/Goal');

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get workouts from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const workouts = await Workout.find({ 
      userId: req.user.id,
      date: { $gte: sevenDaysAgo }
    });

    const nutrition = await Nutrition.find({ 
      userId: req.user.id,
      date: { $gte: sevenDaysAgo }
    });

    // Calculate total workouts and calories
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);

    // Weekly progress data
    const weeklyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayWorkouts = workouts.filter(w => 
        w.date.toISOString().split('T')[0] === dateStr
      );
      
      const dayCalories = dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
      
      weeklyProgress.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: dayCalories
      });
    }

    // Workout type distribution
    const workoutDistribution = [];
    const types = ['cardio', 'strength', 'flexibility', 'hiit', 'sports'];
    
    types.forEach(type => {
      const count = workouts.filter(w => w.type === type).length;
      if (count > 0) {
        workoutDistribution.push({ type, count });
      }
    });

    res.json({
      totalWorkouts,
      totalCalories,
      weeklyProgress,
      workoutDistribution
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;