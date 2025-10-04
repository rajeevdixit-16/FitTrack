import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Card, Button, Grid, FormGroup, Input, Select, ExerciseCard, ExerciseGrid } from '../styles/Components';
import { FaPlus, FaDumbbell, FaRunning, FaHeart, FaTrash } from 'react-icons/fa';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'strength',
    duration: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '' }],
    notes: ''
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await api.get('/workouts');
      setWorkouts(res.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/workouts', {
        ...formData,
        duration: parseInt(formData.duration),
        exercises: formData.exercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets ? parseInt(exercise.sets) : 0,
          reps: exercise.reps ? parseInt(exercise.reps) : 0,
          weight: exercise.weight ? parseInt(exercise.weight) : 0
        }))
      });
      setShowForm(false);
      setFormData({
        name: '',
        type: 'strength',
        duration: '',
        exercises: [{ name: '', sets: '', reps: '', weight: '' }],
        notes: ''
      });
      fetchWorkouts();
    } catch (error) {
      console.error('Error creating workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index][field] = value;
    setFormData({
      ...formData,
      exercises: newExercises
    });
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: '', reps: '', weight: '' }]
    });
  };

  const removeExercise = (index) => {
    const newExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      exercises: newExercises
    });
  };

  const deleteWorkout = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await api.delete(`/workouts/${workoutId}`);
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const getWorkoutIcon = (type) => {
    switch (type) {
      case 'strength': return <FaDumbbell />;
      case 'cardio': return <FaRunning />;
      case 'hiit': return <FaHeart />;
      default: return <FaDumbbell />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Workouts</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <FaPlus style={{ marginRight: '8px' }} />
          Add Workout
        </Button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: '2rem' }}>
          <h3>Add New Workout</h3>
          <form onSubmit={handleSubmit}>
            <Grid>
              <FormGroup>
                <label>Workout Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Morning Cardio Session"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Type</label>
                <Select name="type" value={formData.type} onChange={handleChange}>
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="hiit">HIIT</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="sports">Sports</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label>Duration (minutes)</label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 45"
                  required
                />
              </FormGroup>
            </Grid>

            <FormGroup>
              <label>Exercises</label>
              {formData.exercises.map((exercise, index) => (
                <ExerciseCard key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4>Exercise {index + 1}</h4>
                    {formData.exercises.length > 1 && (
                      <Button 
                        type="button" 
                        onClick={() => removeExercise(index)}
                        style={{ background: '#dc3545', padding: '8px 12px' }}
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </div>
                  <ExerciseGrid>
                    <div>
                      <Input
                        placeholder="Exercise name"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      type="number"
                      placeholder="Sets"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Weight (kg)"
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                    />
                  </ExerciseGrid>
                </ExerciseCard>
              ))}
              <Button type="button" onClick={addExercise} style={{ background: '#28a745' }}>
                <FaPlus />
                Add Exercise
              </Button>
            </FormGroup>

            <FormGroup>
              <label>Notes (Optional)</label>
              <Input
                as="textarea"
                rows="3"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes about your workout..."
              />
            </FormGroup>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Workout'}
              </Button>
              <Button 
                type="button" 
                onClick={() => setShowForm(false)}
                style={{ background: 'transparent', color: '#666', border: '2px solid #e1e5e9' }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {workouts.length === 0 && !showForm ? (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <FaDumbbell style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }} />
          <h3>No Workouts Yet</h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Start tracking your fitness journey by adding your first workout!
          </p>
          <Button onClick={() => setShowForm(true)}>
            <FaPlus />
            Log Your First Workout
          </Button>
        </Card>
      ) : (
        <Grid>
          {workouts.map(workout => (
            <Card key={workout._id} whileHover={{ scale: 1.02 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem', color: '#667eea' }}>
                    {getWorkoutIcon(workout.type)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{workout.name}</h3>
                    <p style={{ margin: 0, color: '#666', textTransform: 'capitalize' }}>
                      {workout.type} • {formatDate(workout.date)}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => deleteWorkout(workout._id)}
                  style={{ background: '#dc3545', padding: '8px 12px' }}
                >
                  <FaTrash />
                </Button>
              </div>
              
              <p><strong>Duration:</strong> {workout.duration} minutes</p>
              {workout.caloriesBurned > 0 && (
                <p><strong>Calories Burned:</strong> {workout.caloriesBurned}</p>
              )}
              <p><strong>Exercises:</strong> {workout.exercises.length}</p>
              
              {workout.notes && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Notes:</strong> {workout.notes}
                </div>
              )}

              <div style={{ marginTop: '1rem' }}>
                <h4>Exercises:</h4>
                {workout.exercises.map((exercise, index) => (
                  <div key={index} style={{ 
                    padding: '0.5rem', 
                    borderBottom: '1px solid #e1e5e9',
                    fontSize: '0.9rem'
                  }}>
                    <strong>{exercise.name}</strong>
                    {exercise.sets > 0 && ` • ${exercise.sets} sets`}
                    {exercise.reps > 0 && ` • ${exercise.reps} reps`}
                    {exercise.weight > 0 && ` • ${exercise.weight} kg`}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Workouts;