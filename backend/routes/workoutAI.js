const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const router = express.Router();

// Nutritionix API configuration (same as nutrition)
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY;

// Calculate calories burned for exercises
router.post('/calculate-calories', auth, async (req, res) => {
  try {
    const { exercises, duration, userWeight = 70 } = req.body; // Default weight 70kg

    if (!exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ message: 'Exercises array is required' });
    }

    let totalCalories = 0;
    const exerciseDetails = [];

    // Calculate calories for each exercise
    for (const exercise of exercises) {
      if (!exercise.name) continue;

      let exerciseCalories = 0;
      
      try {
        // Try to get MET (Metabolic Equivalent of Task) value from Nutritionix
        const response = await axios.get(
          `https://trackapi.nutritionix.com/v2/search/instant`,
          {
            params: {
              query: exercise.name,
              detailed: true
            },
            headers: {
              'x-app-id': NUTRITIONIX_APP_ID,
              'x-app-key': NUTRITIONIX_APP_KEY
            }
          }
        );

        // If we get data from Nutritionix, use it
        if (response.data.common && response.data.common.length > 0) {
          const met = getMETValue(exercise.name); // Get MET value based on exercise
          const exerciseDuration = exercise.duration || (duration / exercises.length);
          exerciseCalories = calculateCaloriesBurned(met, userWeight, exerciseDuration);
        } else {
          // Fallback: Estimate based on exercise type and duration
          exerciseCalories = estimateCalories(exercise, duration, exercises.length, userWeight);
        }
      } catch (error) {
        // Fallback if API fails
        console.log('Nutritionix API failed, using estimation:', error.message);
        exerciseCalories = estimateCalories(exercise, duration, exercises.length, userWeight);
      }

      totalCalories += Math.round(exerciseCalories);
      exerciseDetails.push({
        name: exercise.name,
        calories: Math.round(exerciseCalories),
        duration: exercise.duration || (duration / exercises.length)
      });
    }

    res.json({
      totalCalories,
      exerciseDetails,
      userWeight
    });

  } catch (error) {
    console.error('Calorie calculation error:', error);
    
    // Fallback calculation
    const fallbackCalories = calculateFallbackCalories(req.body);
    
    res.json({
      totalCalories: fallbackCalories,
      exerciseDetails: [],
      userWeight: req.body.userWeight || 70,
      note: 'Used fallback calculation'
    });
  }
});

// MET values for common exercises (Metabolic Equivalent of Task)
function getMETValue(exerciseName) {
  const metValues = {
    // Cardio exercises
    'running': 8, 'jogging': 7, 'sprinting': 12, 'walking': 3.5,
    'cycling': 8, 'swimming': 8, 'jump rope': 10, 'elliptical': 5,
    
    // Strength training
    'weight lifting': 6, 'strength training': 6, 'bodybuilding': 6,
    'push ups': 8, 'pull ups': 8, 'squats': 5, 'deadlifts': 6,
    'bench press': 5, 'shoulder press': 5, 'bicep curls': 3,
    
    // HIIT and sports
    'hiit': 10, 'circuit training': 8, 'crossfit': 8,
    'basketball': 8, 'soccer': 7, 'tennis': 7, 'yoga': 3,
    
    // Default for unknown exercises
    'default': 5
  };

  const lowerName = exerciseName.toLowerCase();
  
  for (const [key, value] of Object.entries(metValues)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }
  
  return metValues.default;
}

// Calculate calories using MET formula: Calories = MET * weight(kg) * time(hours)
function calculateCaloriesBurned(met, weightKg, durationMinutes) {
  const durationHours = durationMinutes / 60;
  return met * weightKg * durationHours;
}

// Estimate calories based on exercise type
function estimateCalories(exercise, totalDuration, exerciseCount, userWeight) {
  const baseCaloriesPerMinute = 0.1; // Base calories per minute per kg
  const intensityMultiplier = getIntensityMultiplier(exercise.name);
  const exerciseDuration = exercise.duration || (totalDuration / exerciseCount);
  
  return baseCaloriesPerMinute * userWeight * exerciseDuration * intensityMultiplier;
}

function getIntensityMultiplier(exerciseName) {
  const lowerName = exerciseName.toLowerCase();
  
  if (lowerName.includes('sprint') || lowerName.includes('hiit') || lowerName.includes('jump')) {
    return 1.5;
  } else if (lowerName.includes('run') || lowerName.includes('cycle') || lowerName.includes('swim')) {
    return 1.2;
  } else if (lowerName.includes('walk') || lowerName.includes('yoga')) {
    return 0.7;
  } else {
    return 1.0; // Default for strength training
  }
}

function calculateFallbackCalories(workoutData) {
  const { exercises, duration, userWeight = 70 } = workoutData;
  
  if (!exercises || !duration) return 0;
  
  // Simple fallback: 5 calories per minute per exercise
  const baseRate = 5;
  const exerciseCount = exercises.length;
  const caloriesPerExercise = (duration / exerciseCount) * baseRate;
  
  return Math.round(caloriesPerExercise * exerciseCount);
}

module.exports = router;