import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Card, Button, Grid, FormGroup, Input, Select } from '../styles/Components';
import { FaUtensils, FaPlus, FaFire, FaCarrot, FaDrumstickBite, FaTrash, FaHamburger, FaAppleAlt, FaCalendar, FaChartBar, FaHistory } from 'react-icons/fa';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('today'); // 'today' or 'history'
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [monthlyData, setMonthlyData] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchMonthlyData();
    }
  }, [activeTab, selectedMonth]);

  const fetchMeals = async () => {
    try {
      const res = await api.get('/nutrition');
      setMeals(res.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const res = await api.get(`/nutrition/monthly?month=${selectedMonth}`);
      setMonthlyData(res.data);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/nutrition', {
        ...formData,
        calories: parseInt(formData.calories) || 0,
        protein: parseInt(formData.protein) || 0,
        carbs: parseInt(formData.carbs) || 0,
        fat: parseInt(formData.fat) || 0
      });
      setShowForm(false);
      setFormData({
        name: '',
        type: 'breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchMeals();
      if (activeTab === 'history') {
        fetchMonthlyData();
      }
    } catch (error) {
      console.error('Error creating meal:', error);
      alert('Error adding meal. Please try again.');
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

  const deleteMeal = async (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await api.delete(`/nutrition/${mealId}`);
        fetchMeals();
        if (activeTab === 'history') {
          fetchMonthlyData();
        }
      } catch (error) {
        console.error('Error deleting meal:', error);
      }
    }
  };

  // Today's Nutrition Calculation
  const getTodayNutrition = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = meals.filter(meal => 
      new Date(meal.date).toISOString().split('T')[0] === today
    );

    return todayMeals.reduce((total, meal) => ({
      calories: total.calories + (meal.calories || 0),
      protein: total.protein + (meal.protein || 0),
      carbs: total.carbs + (meal.carbs || 0),
      fat: total.fat + (meal.fat || 0),
      mealCount: total.mealCount + 1
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 });
  };

  const todayNutrition = getTodayNutrition();

  // Generate month options for dropdown
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    // Generate last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      months.push({ value, label });
    }
    
    return months;
  };

  const monthOptions = generateMonthOptions();

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaUtensils />
          Nutrition
        </h1>
        <Button 
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
          {showForm ? 'Cancel' : 'Add Meal'}
        </Button>
      </div>

      {/* Tab Navigation */}
      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e1e5e9' }}>
          <Button
            onClick={() => setActiveTab('today')}
            style={{ 
              background: activeTab === 'today' ? '#667eea' : 'transparent',
              color: activeTab === 'today' ? 'white' : '#666',
              border: 'none',
              borderRadius: '0',
              borderBottom: activeTab === 'today' ? '2px solid #667eea' : 'none'
            }}
          >
            <FaFire style={{ marginRight: '0.5rem' }} />
            Today's Summary
          </Button>
          <Button
            onClick={() => setActiveTab('history')}
            style={{ 
              background: activeTab === 'history' ? '#667eea' : 'transparent',
              color: activeTab === 'history' ? 'white' : '#666',
              border: 'none',
              borderRadius: '0',
              borderBottom: activeTab === 'history' ? '2px solid #667eea' : 'none'
            }}
          >
            <FaHistory style={{ marginRight: '0.5rem' }} />
            Monthly History
          </Button>
        </div>
      </Card>

      {/* Add Meal Form */}
      {showForm && (
        <Card style={{ marginBottom: '2rem' }}>
          <h3>Add New Meal</h3>
          <form onSubmit={handleSubmit}>
            <Grid>
              <FormGroup>
                <label>Meal Name *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Chicken Salad"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Meal Type</label>
                <Select name="type" value={formData.type} onChange={handleChange}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label>Date *</label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Calories</label>
                <Input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="kcal"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Protein (g)</label>
                <Input
                  type="number"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  placeholder="grams"
                />
              </FormGroup>

              <FormGroup>
                <label>Carbs (g)</label>
                <Input
                  type="number"
                  name="carbs"
                  value={formData.carbs}
                  onChange={handleChange}
                  placeholder="grams"
                />
              </FormGroup>

              <FormGroup>
                <label>Fat (g)</label>
                <Input
                  type="number"
                  name="fat"
                  value={formData.fat}
                  onChange={handleChange}
                  placeholder="grams"
                />
              </FormGroup>
            </Grid>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Meal'}
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

      {/* Today's Summary Tab */}
      {activeTab === 'today' && (
        <>
          <Grid>
            <Card>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FaFire />
                Today's Calories
              </h3>
              <h2 style={{ color: '#667eea', fontSize: '2.5rem' }}>{todayNutrition.calories}</h2>
              <p>kcal from {todayNutrition.mealCount} meals</p>
            </Card>

            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Protein</h3>
              <h2 style={{ color: '#28a745', fontSize: '2.5rem' }}>{todayNutrition.protein}g</h2>
            </Card>

            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Carbs</h3>
              <h2 style={{ color: '#ffc107', fontSize: '2.5rem' }}>{todayNutrition.carbs}g</h2>
            </Card>

            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Fat</h3>
              <h2 style={{ color: '#dc3545', fontSize: '2.5rem' }}>{todayNutrition.fat}g</h2>
            </Card>
          </Grid>

          <Card>
            <h3>Today's Meals</h3>
            {meals.filter(meal => new Date(meal.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                No meals logged for today.
              </p>
            ) : (
              <div>
                {meals
                  .filter(meal => new Date(meal.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0])
                  .map(meal => (
                    <div key={meal._id} style={{ 
                      padding: '1rem', 
                      borderBottom: '1px solid #e1e5e9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '1.5rem', color: '#667eea' }}>
                          {meal.type === 'breakfast' && <FaAppleAlt />}
                          {meal.type === 'lunch' && <FaHamburger />}
                          {meal.type === 'dinner' && <FaUtensils />}
                          {meal.type === 'snack' && <FaCarrot />}
                        </div>
                        <div>
                          <h4 style={{ margin: 0 }}>{meal.name}</h4>
                          <p style={{ margin: 0, color: '#666', textTransform: 'capitalize' }}>
                            {meal.type}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#667eea' }}>{meal.calories} kcal</strong>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                        </div>
                      </div>
                      <Button 
                        onClick={() => deleteMeal(meal._id)}
                        style={{ background: '#dc3545', padding: '8px 12px' }}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </>
      )}

      {/* Monthly History Tab */}
      {activeTab === 'history' && (
        <>
          <Card style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <FaCalendar />
              <h3 style={{ margin: 0 }}>Select Month</h3>
            </div>
            <Select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ maxWidth: '300px' }}
            >
              {monthOptions.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Select>
          </Card>

          <Grid>
            <Card>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FaChartBar />
                Monthly Summary - {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              
              {monthlyData.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  No data available for this month.
                </p>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <strong>Total Calories</strong>
                      <div style={{ fontSize: '1.5rem', color: '#667eea' }}>
                        {monthlyData.reduce((sum, day) => sum + day.totalCalories, 0)}
                      </div>
                    </div>
                    <div>
                      <strong>Days Tracked</strong>
                      <div style={{ fontSize: '1.5rem', color: '#28a745' }}>
                        {monthlyData.length}
                      </div>
                    </div>
                  </div>

                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {monthlyData.map(day => (
                      <div key={day.date} style={{
                        padding: '1rem',
                        border: '1px solid #e1e5e9',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        background: '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                          <span style={{ color: '#667eea', fontWeight: 'bold' }}>{day.totalCalories} kcal</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                          <span>P: {day.totalProtein}g</span>
                          <span>C: {day.totalCarbs}g</span>
                          <span>F: {day.totalFat}g</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem' }}>
                          {day.mealCount} meals
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>

            <Card>
              <h3>Monthly Averages</h3>
              {monthlyData.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  No data available
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <strong>Average Daily Calories</strong>
                    <div style={{ fontSize: '1.5rem', color: '#667eea' }}>
                      {Math.round(monthlyData.reduce((sum, day) => sum + day.totalCalories, 0) / monthlyData.length)}
                    </div>
                  </div>
                  <div>
                    <strong>Average Protein</strong>
                    <div style={{ fontSize: '1.2rem', color: '#28a745' }}>
                      {Math.round(monthlyData.reduce((sum, day) => sum + day.totalProtein, 0) / monthlyData.length)}g
                    </div>
                  </div>
                  <div>
                    <strong>Average Carbs</strong>
                    <div style={{ fontSize: '1.2rem', color: '#ffc107' }}>
                      {Math.round(monthlyData.reduce((sum, day) => sum + day.totalCarbs, 0) / monthlyData.length)}g
                    </div>
                  </div>
                  <div>
                    <strong>Average Fat</strong>
                    <div style={{ fontSize: '1.2rem', color: '#dc3545' }}>
                      {Math.round(monthlyData.reduce((sum, day) => sum + day.totalFat, 0) / monthlyData.length)}g
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </Grid>
        </>
      )}
    </div>
  );
};

export default Nutrition;