const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    default: 0
  },
  reps: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  caloriesBurned: {
    type: Number,
    default: 0
  }
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'hiit', 'sports'],
    required: true
  },
  exercises: [exerciseSchema],
  duration: {
    type: Number,
    required: true
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);