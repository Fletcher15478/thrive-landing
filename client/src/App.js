import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import Sidebar from './components/Sidebar';
import Splash from './components/Splash';
import './App.css';
import Cards from './components/Cards';
import ProfileSetup from './components/ProfileSetup';
import ProfilePage from './components/ProfilePage';
import WorkoutsPage from './components/WorkoutsPage';
import AIPlans from './components/AIPlans';
import ModifyWorkout from './components/ModifyWorkout';
import ProgressPage from './components/ProgressPage';
import MacroTracker from './components/MacroTracker';
import About from './components/About';
import MacroRingChart from './components/MacroRingChart';
import WorkoutEntry from './components/WorkoutEntry';
import DailyCheckIn from './components/DailyCheckIn';
import CheckInToast from './components/CheckInToast';
import LandingPage from './components/LandingPage';

import Jeep from './components/Jeep';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="./sidebar" element={<Sidebar/>}/>
        <Route path="./cards" element={<Cards/>}/>
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/aiplans" element={<AIPlans />} />
        <Route path="/modify" element={<ModifyWorkout />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/macrotracker" element={<MacroTracker/>}/>
        <Route path="/macro-ring-chart" element={<MacroRingChart/>}/>
        <Route path="/workout-entry/:workoutId" element={<WorkoutEntry />} />
        <Route path="/daily-check-in" element={<DailyCheckIn />} />
        <Route path="/checkin-toast" element={<CheckInToast />} />
        <Route path="/jeep" element={<Jeep/>} />
        <Route path="/" element={<LandingPage />} />


<Route path="/about" element={<About />} />

<Route path="/workouts" element={<WorkoutsPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
