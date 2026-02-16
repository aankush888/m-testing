import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PatientCard } from '../../components/PatientCard';
import './TherapistDashboard.css';

export const TherapistDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Mock patient data
    const patients = [
        { id: 1, name: 'Sarah Johnson', age: 28, lastSession: '2 days ago', nextSession: 'Tomorrow 2pm', riskLevel: 'low' as const, currentMood: 4, engagement: 'active' as const },
        { id: 2, name: 'John Smith', age: 35, lastSession: '1 week ago', riskLevel: 'medium' as const, currentMood: 2, engagement: 'moderate' as const },
        { id: 3, name: 'Emily Davis', age: 42, lastSession: '3 days ago', nextSession: 'Friday 10am', riskLevel: 'low' as const, currentMood: 5, engagement: 'active' as const },
        { id: 4, name: 'Michael Brown', age: 31, lastSession: '2 weeks ago', riskLevel: 'high' as const, currentMood: 1, engagement: 'low' as const },
    ];

    const riskAlerts = patients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'medium');

    return (
        <div className="therapist-dashboard">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1>Professional Dashboard</h1>
                        <p>Welcome back, Dr. {user?.name}</p>
                    </div>
                    <Button variant="ghost" onClick={logout}>
                        Logout
                    </Button>
                </div>

                {riskAlerts.length > 0 && (
                    <Card className="risk-alert-banner">
                        <div className="alert-content">
                            <span className="alert-icon">⚠️</span>
                            <div>
                                <h4>Risk Alerts ({riskAlerts.length})</h4>
                                <p>Patients requiring immediate attention</p>
                            </div>
                        </div>
                    </Card>
                )}

                <div className="quick-actions">
                    <Button
                        variant="primary"
                        onClick={() => navigate('/therapist/session-notes')}
                    >
                        📝 New Session Note
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/therapist/analytics')}
                    >
                        📊 Analytics
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/therapist/assessments')}
                    >
                        📋 Assessments
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => alert('View calendar (demo)')}
                    >
                        📅 Calendar
                    </Button>
                </div>

                <div className="patients-section">
                    <div className="section-header">
                        <h2>My Patients</h2>
                        <span className="patient-count">{patients.length} active patients</span>
                    </div>

                    <div className="patients-grid">
                        {patients.map(patient => (
                            <PatientCard key={patient.id} patient={patient} />
                        ))}
                    </div>
                </div>

                <Card className="demo-note-professional">
                    <h3>🩺 Professional Portal Features</h3>
                    <div className="feature-grid">
                        <div className="feature-item">
                            <span className="feature-icon">🎤</span>
                            <h4>Voice-to-Text Documentation</h4>
                            <p>Dictate session notes with AI transcription</p>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🤖</span>
                            <h4>AI Clinical Insights</h4>
                            <p>Pattern detection with human-in-the-loop approval</p>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">⚠️</span>
                            <h4>Risk Detection</h4>
                            <p>Early warning system for patient safety</p>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📈</span>
                            <h4>Longitudinal Tracking</h4>
                            <p>Visualize patient progress over time</p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/client/dashboard')}
                        className="mt-lg"
                    >
                        Switch to Client View
                    </Button>
                </Card>
            </div>
        </div>
    );
};
