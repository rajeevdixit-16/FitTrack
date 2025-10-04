import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Card, Button, Grid, FormGroup, Input, Select } from '../styles/Components';
import { FaBullseye, FaPlus, FaCheck, FaRunning, FaWeight, FaUtensils, FaTrash, FaEdit } from 'react-icons/fa';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressInputs, setProgressInputs] = useState({});
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'workout',
    target: '',
    current: '0',
    deadline: '',
    unit: ''
  });

  // Move helper functions to the top
  const getProgressPercentage = (current, target) => {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#28a745';
    if (percentage >= 75) return '#17a2b8';
    if (percentage >= 50) return '#ffc107';
    return '#dc3545';
  };

  const isGoalOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalIcon = (type) => {
    switch (type) {
      case 'workout': return <FaRunning />;
      case 'weight': return <FaWeight />;
      case 'nutrition': return <FaUtensils />;
      default: return <FaBullseye />;
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => {
      const progress = getProgressPercentage(goal.current, goal.target);
      return progress >= 100;
    }).length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const goalsThisMonth = goals.filter(goal => {
      const goalDate = new Date(goal.deadline);
      const progress = getProgressPercentage(goal.current, goal.target);
      return progress >= 100 && 
             goalDate.getMonth() === currentMonth && 
             goalDate.getFullYear() === currentYear;
    }).length;

    const completionPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    return {
      totalCompleted: completedGoals,
      completedThisMonth: goalsThisMonth,
      completionPercentage: completionPercentage
    };
  };

  const stats = calculateStats();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingGoal) {
        // Update existing goal
        await api.put(`/goals/${editingGoal}`, {
          ...formData,
          target: parseInt(formData.target),
          current: parseInt(formData.current)
        });
        setEditingGoal(null);
      } else {
        // Create new goal
        await api.post('/goals', {
          ...formData,
          target: parseInt(formData.target),
          current: parseInt(formData.current)
        });
      }
      setShowForm(false);
      setFormData({
        title: '',
        type: 'workout',
        target: '',
        current: '0',
        deadline: '',
        unit: ''
      });
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Error saving goal. Please try again.');
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

  const updateGoalProgress = async (goalId, newCurrent) => {
    if (!newCurrent || newCurrent === '' || isNaN(newCurrent)) {
      alert('Please enter a valid number for progress');
      return;
    }
    
    const currentValue = parseInt(newCurrent);
    const goal = goals.find(g => g._id === goalId);
    
    if (currentValue > goal.target) {
      if (!window.confirm(`Progress (${currentValue}) exceeds target (${goal.target}). Do you want to mark this goal as completed?`)) {
        return;
      }
    }
    
    try {
      await api.put(`/goals/${goalId}`, { 
        current: currentValue,
        completed: currentValue >= goal.target
      });
      setProgressInputs(prev => ({ ...prev, [goalId]: '' }));
      fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
      alert('Error updating goal progress. Please try again.');
    }
  };

  const deleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/goals/${goalId}`);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const editGoal = (goal) => {
    setEditingGoal(goal._id);
    setFormData({
      title: goal.title,
      type: goal.type,
      target: goal.target.toString(),
      current: goal.current.toString(),
      deadline: goal.deadline.split('T')[0],
      unit: goal.unit
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingGoal(null);
    setShowForm(false);
    setFormData({
      title: '',
      type: 'workout',
      target: '',
      current: '0',
      deadline: '',
      unit: ''
    });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Goals</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <FaPlus />
          New Goal
        </Button>
      </div>

      {/* Statistics Cards */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Card style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
            {stats.totalCompleted}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Total Completed Goals</p>
        </Card>

        <Card style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
            {stats.completedThisMonth}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Completed This Month</p>
        </Card>

        <Card style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
            {stats.completionPercentage}%
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Goals Completed</p>
        </Card>
      </Grid>

      {showForm && (
        <Card style={{ marginBottom: '2rem' }}>
          <h3>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h3>
          <form onSubmit={handleSubmit}>
            <Grid>
              <FormGroup>
                <label>Goal Title *</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Run 5km without stopping"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Goal Type *</label>
                <Select name="type" value={formData.type} onChange={handleChange}>
                  <option value="workout">Workout</option>
                  <option value="weight">Weight</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label>Target *</label>
                <Input
                  type="number"
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  required
                  min="1"
                />
              </FormGroup>

              <FormGroup>
                <label>Current Progress</label>
                <Input
                  type="number"
                  name="current"
                  value={formData.current}
                  onChange={handleChange}
                  placeholder="e.g., 0"
                  min="0"
                />
              </FormGroup>

              <FormGroup>
                <label>Unit *</label>
                <Input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g., km, kg, days"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Deadline *</label>
                <Input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormGroup>
            </Grid>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingGoal ? 'Update Goal' : 'Create Goal')}
              </Button>
              <Button 
                type="button" 
                onClick={editingGoal ? cancelEdit : () => setShowForm(false)}
                style={{ background: 'transparent', color: '#666', border: '2px solid #e1e5e9' }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Grid>
        {goals.map(goal => {
          const progress = getProgressPercentage(goal.current, goal.target);
          const progressColor = getProgressColor(progress);
          const isCompleted = progress >= 100;
          const isOverdue = isGoalOverdue(goal.deadline);
          const daysRemaining = getDaysRemaining(goal.deadline);

          return (
            <Card key={goal._id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: progressColor, fontSize: '1.5rem' }}>
                    {getGoalIcon(goal.type)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{goal.title}</h3>
                    <p style={{ margin: 0, color: '#666', textTransform: 'capitalize' }}>
                      {goal.type} goal • {goal.unit}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isCompleted && (
                    <FaCheck style={{ color: '#28a745', fontSize: '1.2rem' }} />
                  )}
                  <Button 
                    onClick={() => editGoal(goal)}
                    style={{ background: '#17a2b8', padding: '8px 12px' }}
                  >
                    <FaEdit />
                  </Button>
                  <Button 
                    onClick={() => deleteGoal(goal._id)}
                    style={{ background: '#dc3545', padding: '8px 12px' }}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  <span>Progress: {goal.current} / {goal.target} {goal.unit}</span>
                  <span>{progress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e1e5e9',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: progressColor,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '0.9rem',
                color: isOverdue && !isCompleted ? '#dc3545' : '#666',
                marginBottom: '1rem'
              }}>
                <span>
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  {isOverdue && !isCompleted && ' (Overdue)'}
                </span>
                {!isCompleted && !isOverdue && (
                  <span style={{ color: daysRemaining <= 7 ? '#dc3545' : '#666' }}>
                    {daysRemaining} days left
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Input
                  type="number"
                  placeholder="Update progress"
                  value={progressInputs[goal._id] || ''}
                  onChange={(e) => setProgressInputs(prev => ({ 
                    ...prev, 
                    [goal._id]: e.target.value 
                  }))}
                  style={{ flex: 1 }}
                  min="0"
                  max={goal.target}
                />
                <Button 
                  onClick={() => updateGoalProgress(goal._id, progressInputs[goal._id])}
                  style={{ background: '#28a745' }}
                  disabled={!progressInputs[goal._id] || progressInputs[goal._id] === ''}
                >
                  Update
                </Button>
              </div>

              {isCompleted && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: '#d4edda',
                  color: '#155724',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}>
                  🎉 Goal Completed! Congratulations!
                </div>
              )}

              {isOverdue && !isCompleted && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: '#f8d7da',
                  color: '#721c24',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}>
                  ⚠️ Deadline passed. Consider extending your goal!
                </div>
              )}
            </Card>
          );
        })}
      </Grid>

      {goals.length === 0 && !showForm && (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <FaBullseye style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }} />
          <h3>No Goals Yet</h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Set your first fitness goal to start tracking your progress!
          </p>
          <Button onClick={() => setShowForm(true)}>
            <FaPlus />
            Create Your First Goal
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Goals;