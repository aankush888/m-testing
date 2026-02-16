import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import './CaregiverDashboard.css';

export const CaregiverDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="caregiver-dashboard">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1>Caregiver Dashboard</h1>
                        <p>Welcome, {user?.name}</p>
                    </div>
                    <Button variant="ghost" onClick={logout}>
                        Logout
                    </Button>
                </div>

                <Card className="status-card">
                    <h3>📊 Client Progress Summary</h3>
                    <div className="progress-info">
                        <div className="progress-item">
                            <span className="progress-label">Overall Mood Trend</span>
                            <span className="progress-value positive">Improving ↗</span>
                        </div>
                        <div className="progress-item">
                            <span className="progress-label">Engagement</span>
                            <span className="progress-value">Active</span>
                        </div>
                        <div className="progress-item">
                            <span className="progress-label">Last Check-In</span>
                            <span className="progress-value">2 hours ago</span>
                        </div>
                    </div>
                </Card>

                <Card className="demo-note">
                    <h3>🛡️ Privacy-First Caregiver Access</h3>
                    <p>
                        As a caregiver, you only see what your loved one chooses to share:
                    </p>
                    <ul>
                        <li>✅ Progress summaries (with consent)</li>
                        <li>✅ Crisis alerts (if enabled)</li>
                        <li>❌ Personal journal entries (private by default)</li>
                        <li>❌ Detailed mood logs (unless shared)</li>
                    </ul>
                    <p className="privacy-note">
                        This demo shows a simplified view. The actual system provides granular privacy controls.
                    </p>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/client/dashboard')}
                        className="mt-md"
                    >
                        Switch to Client View
                    </Button>
                </Card>
            </div>
        </div>
    );
};
