import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Grid, FormGroup, Input, Select } from '../styles/Components';
import { FaUser, FaSave, FaWeight, FaRulerVertical, FaVenusMars, FaDumbbell } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profile: {
      age: '',
      weight: '',
      height: '',
      gender: '',
      fitnessLevel: ''
    },
    goals: {
      targetWeight: '',
      dailyCalories: '',
      workoutFrequency: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        profile: {
          age: user.profile?.age || '',
          weight: user.profile?.weight || '',
          height: user.profile?.height || '',
          gender: user.profile?.gender || '',
          fitnessLevel: user.profile?.fitnessLevel || ''
        },
        goals: {
          targetWeight: user.goals?.targetWeight || '',
          dailyCalories: user.goals?.dailyCalories || '',
          workoutFrequency: user.goals?.workoutFrequency || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('profile.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value
        }
      }));
    } else if (name.startsWith('goals.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile({
      ...formData,
      profile: {
        ...formData.profile,
        age: formData.profile.age ? parseInt(formData.profile.age) : undefined,
        weight: formData.profile.weight ? parseFloat(formData.profile.weight) : undefined,
        height: formData.profile.height ? parseFloat(formData.profile.height) : undefined
      },
      goals: {
        ...formData.goals,
        targetWeight: formData.goals.targetWeight ? parseFloat(formData.goals.targetWeight) : undefined,
        dailyCalories: formData.goals.dailyCalories ? parseInt(formData.goals.dailyCalories) : undefined,
        workoutFrequency: formData.goals.workoutFrequency ? parseInt(formData.goals.workoutFrequency) : undefined
      }
    });
    
    if (result.success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const calculateBMI = () => {
    if (!formData.profile.weight || !formData.profile.height) return null;
    const heightInMeters = formData.profile.height / 100;
    return (formData.profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const bmi = calculateBMI();
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#ffc107' };
    if (bmi < 25) return { category: 'Normal', color: '#28a745' };
    if (bmi < 30) return { category: 'Overweight', color: '#fd7e14' };
    return { category: 'Obese', color: '#dc3545' };
  };

  const bmiInfo = bmi ? getBMICategory(bmi) : null;

  if (!user) {
    return (
      <div className="container">
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Loading profile...</h3>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <FaUser />
            Edit Profile
          </Button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button 
              onClick={() => setIsEditing(false)}
              style={{ background: 'transparent', color: '#666', border: '2px solid #e1e5e9' }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <FaSave />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <Grid>
        {/* Personal Information */}
        <Card>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <FaUser />
            Personal Information
          </h3>
          
          <form onSubmit={handleSubmit}>
            <Grid>
              <FormGroup>
                <label>Username</label>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup>
                <label>Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup>
                <label>Age</label>
                <Input
                  type="number"
                  name="profile.age"
                  value={formData.profile.age}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="1"
                  max="120"
                />
              </FormGroup>

              <FormGroup>
                <label>Gender</label>
                <Select
                  name="profile.gender"
                  value={formData.profile.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label>Weight (kg)</label>
                <Input
                  type="number"
                  name="profile.weight"
                  value={formData.profile.weight}
                  onChange={handleChange}
                  disabled={!isEditing}
                  step="0.1"
                  min="1"
                />
              </FormGroup>

              <FormGroup>
                <label>Height (cm)</label>
                <Input
                  type="number"
                  name="profile.height"
                  value={formData.profile.height}
                  onChange={handleChange}
                  disabled={!isEditing}
                  step="0.1"
                  min="1"
                />
              </FormGroup>

              <FormGroup>
                <label>Fitness Level</label>
                <Select
                  name="profile.fitnessLevel"
                  value={formData.profile.fitnessLevel}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </FormGroup>
            </Grid>
          </form>
        </Card>

        {/* Fitness Goals & Stats */}
        <div>
          <Card style={{ marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <FaDumbbell />
              Fitness Goals
            </h3>

            <Grid>
              <FormGroup>
                <label>Target Weight (kg)</label>
                <Input
                  type="number"
                  name="goals.targetWeight"
                  value={formData.goals.targetWeight}
                  onChange={handleChange}
                  disabled={!isEditing}
                  step="0.1"
                  min="1"
                />
              </FormGroup>

              <FormGroup>
                <label>Daily Calories</label>
                <Input
                  type="number"
                  name="goals.dailyCalories"
                  value={formData.goals.dailyCalories}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="1"
                />
              </FormGroup>

              <FormGroup>
                <label>Workouts per Week</label>
                <Input
                  type="number"
                  name="goals.workoutFrequency"
                  value={formData.goals.workoutFrequency}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="1"
                  max="7"
                />
              </FormGroup>
            </Grid>
          </Card>

          {/* BMI Calculator */}
          <Card>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <FaWeight />
              BMI Calculator
            </h3>
            {bmi ? (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: bmiInfo.color, marginBottom: '0.5rem' }}>
                  {bmi}
                </div>
                <div style={{ 
                  fontSize: '1.2rem', 
                  color: bmiInfo.color,
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {bmiInfo.category}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  Based on your weight and height
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#666' }}>
                Enter your weight and height to calculate BMI
              </div>
            )}
          </Card>
        </div>
      </Grid>
    </div>
  );
};

export default Profile;