const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const router = express.Router();

// Nutritionix API configuration
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY;

// Predict nutrition from meal name
router.post('/predict', auth, async (req, res) => {
  try {
    const { mealName } = req.body;

    if (!mealName) {
      return res.status(400).json({ message: 'Meal name is required' });
    }

    // Call Nutritionix API
    const response = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      {
        query: mealName,
        timezone: 'US/Eastern'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': NUTRITIONIX_APP_ID,
          'x-app-key': NUTRITIONIX_APP_KEY,
          'x-remote-user-id': '0'
        }
      }
    );

    if (response.data.foods && response.data.foods.length > 0) {
      const food = response.data.foods[0];
      
      const nutritionData = {
        calories: Math.round(food.nf_calories) || 0,
        protein: Math.round(food.nf_protein) || 0,
        carbs: Math.round(food.nf_total_carbohydrate) || 0,
        fat: Math.round(food.nf_total_fat) || 0,
        servingSize: food.serving_qty + ' ' + food.serving_unit,
        mealName: food.food_name
      };

      res.json(nutritionData);
    } else {
      res.status(404).json({ message: 'No nutrition data found for this meal' });
    }

  } catch (error) {
    console.error('Nutritionix API error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Meal not found in database' });
    }
    
    res.status(500).json({ 
      message: 'Error predicting nutrition data',
      error: error.response?.data || error.message 
    });
  }
});

module.exports = router;