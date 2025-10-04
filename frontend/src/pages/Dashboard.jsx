import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Card, Grid, StatCard } from '../styles/Components';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    weeklyProgress: [],
    workoutDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: stats.weeklyProgress.map(day => day.date),
    datasets: [
      {
        label: 'Calories Burned',
        data: stats.weeklyProgress.map(day => day.calories),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const doughnutData = {
    labels: stats.workoutDistribution.map(w => w.type),
    datasets: [
      {
        data: stats.workoutDistribution.map(w => w.count),
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#ffd89b',
          '#19547b'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Loading dashboard...</h3>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Welcome back, {user?.username}! 👋</h1>
        <p style={{ color: '#666' }}>Here's your fitness overview for this week</p>
      </Card>

      <Grid>
        <StatCard
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3>{stats.totalWorkouts}</h3>
          <p>Total Workouts</p>
        </StatCard>

        <StatCard
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3>{stats.totalCalories}</h3>
          <p>Calories Burned</p>
        </StatCard>

        <StatCard
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3>{(stats.totalWorkouts / 7).toFixed(1)}</h3>
          <p>Workouts/Week</p>
        </StatCard>
      </Grid>

      <Grid>
        <Card>
          <h3 style={{ marginBottom: '1rem' }}>Weekly Progress</h3>
          <Line data={lineChartData} options={chartOptions} />
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1rem' }}>Workout Distribution</h3>
          <Doughnut data={doughnutData} options={chartOptions} />
        </Card>
      </Grid>
    </div>
  );
};

export default Dashboard;