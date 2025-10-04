const express = require('express');
const auth = require('../middleware/auth');
const Nutrition = require('../models/Nutrition');

const router = express.Router();

// Get all nutrition entries for user
router.get('/', auth, async (req, res) => {
  try {
    const nutrition = await Nutrition.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(nutrition);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new nutrition entry
router.post('/', auth, async (req, res) => {
  try {
    const nutrition = new Nutrition({
      ...req.body,
      userId: req.user.id
    });
    await nutrition.save();
    res.status(201).json(nutrition);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get monthly nutrition data
router.get('/monthly', auth, async (req, res) => {
  try {
    const { month } = req.query; // Format: YYYY-MM
    
    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required' });
    }

    // Calculate start and end of month
    const startDate = new Date(month + '-01');
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const meals = await Nutrition.find({
      userId: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Group meals by date and calculate daily totals
    const dailyData = {};
    
    meals.forEach(meal => {
      const dateStr = meal.date.toISOString().split('T')[0];
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = {
          date: dateStr,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          mealCount: 0
        };
      }
      
      dailyData[dateStr].totalCalories += meal.calories || 0;
      dailyData[dateStr].totalProtein += meal.protein || 0;
      dailyData[dateStr].totalCarbs += meal.carbs || 0;
      dailyData[dateStr].totalFat += meal.fat || 0;
      dailyData[dateStr].mealCount += 1;
    });

    // Convert to array and sort by date
    const monthlyData = Object.values(dailyData).sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    res.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;