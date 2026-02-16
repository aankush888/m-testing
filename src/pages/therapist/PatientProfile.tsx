import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import './PatientProfile.css';

export const PatientProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('overview');

    // Mock patient data
    const patient = {
        id: Number(id),
        name: 'Sarah Johnson',
        age: 28,
        email: 'sarah.j@email.com',
        phone: '+1 (555) 123-4567',
        emergencyContact: 'John Johnson (Father) - +1 (555) 987-6543',
        dateOfBirth: '1996-03-15',
        gender: 'Female',
        address: '123 Main St, City, State 12345',

        clinicalInfo: {
            diagnoses: ['Generalized Anxiety Disorder', 'Major Depressive Disorder'],
            medications: ['Sertraline 50mg daily', 'Alprazolam 0.5mg as needed'],
            allergies: ['Penicillin'],
            previousTreatments: ['CBT (2022-2023)', 'Mindfulness-based therapy (2021)'],
        },

        sessions: [
            { date: '2024-02-14', type: 'Follow-up', duration: 50, notes: 'Patient reports improved sleep. Discussed workplace stress management strategies.' },
            { date: '2024-02-07', type: 'Follow-up', duration: 50, notes: 'Continued CBT for anxiety. Patient completing homework assignments consistently.' },
            { date: '2024-01-31', type: 'Initial', duration: 60, notes: 'Initial assessment completed. Treatment plan established.' },
        ],

        moodHistory: [
            { date: '2024-02-16', mood: 4, notes: 'Feeling optimistic' },
            { date: '2024-02-15', mood: 3, notes: 'Neutral day' },
            { date: '2024-02-14', mood: 4, notes: 'Good session with therapist' },
            { date: '2024-02-13', mood: 2, notes: 'Work stress' },
            { date: '2024-02-12', mood: 3, notes: '' },
        ],

        assessments: [
            { date: '2024-02-01', type: 'PHQ-9', score: 12, severity: 'Moderate', trend: 'Improving' },
            { date: '2024-01-15', type: 'GAD-7', score: 15, severity: 'Moderate', trend: 'Stable' },
            { date: '2024-01-01', type: 'PHQ-9', score: 16, severity: 'Moderately Severe', trend: 'Initial' },
        ],

        treatmentPlan: {
            goals: [
                'Reduce anxiety symptoms by 50%',
                'Improve sleep quality',
                'Develop healthy coping mechanisms',
            ],
            interventions: [
                'Weekly CBT sessions',
                'Medication management',
                'Homework: thought records, relaxation exercises',
            ],
            progress: 65,
        },
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '👤' },
        { id: 'clinical', label: 'Clinical History', icon: '🏥' },
        { id: 'sessions', label: 'Sessions', icon: '📋' },
        { id: 'mood', label: 'Mood Timeline', icon: '📊' },
        { id: 'assessments', label: 'Assessments', icon: '📝' },
        { id: 'treatment', label: 'Treatment Plan', icon: '🎯' },
    ];

    return (
        <div className="patient-profile-page">
            <div className="profile-header">
                <div className="header-content">
                    <Button variant="ghost" onClick={() => navigate('/therapist/dashboard')}>
                        ← Back to Dashboard
                    </Button>
                    <div className="patient-header-info">
                        <div className="patient-avatar-large">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h1>{patient.name}</h1>
                            <p>{patient.age} years old • Patient ID: #{patient.id}</p>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" onClick={logout}>
                    Logout
                </Button>
            </div>

            <div className="profile-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="profile-content">
                {activeTab === 'overview' && (
                    <div className="tab-content">
                        <div className="content-grid">
                            <Card>
                                <h3>Contact Information</h3>
                                <div className="info-list">
                                    <div className="info-item">
                                        <span className="info-label">Email</span>
                                        <span className="info-value">{patient.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Phone</span>
                                        <span className="info-value">{patient.phone}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Date of Birth</span>
                                        <span className="info-value">{patient.dateOfBirth}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Gender</span>
                                        <span className="info-value">{patient.gender}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Address</span>
                                        <span className="info-value">{patient.address}</span>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <h3>Emergency Contact</h3>
                                <p className="emergency-contact">{patient.emergencyContact}</p>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'clinical' && (
                    <div className="tab-content">
                        <Card>
                            <h3>Diagnoses</h3>
                            <ul className="clinical-list">
                                {patient.clinicalInfo.diagnoses.map((diagnosis, i) => (
                                    <li key={i}>{diagnosis}</li>
                                ))}
                            </ul>
                        </Card>

                        <Card>
                            <h3>Current Medications</h3>
                            <ul className="clinical-list">
                                {patient.clinicalInfo.medications.map((med, i) => (
                                    <li key={i}>{med}</li>
                                ))}
                            </ul>
                        </Card>

                        <Card>
                            <h3>Allergies</h3>
                            <ul className="clinical-list">
                                {patient.clinicalInfo.allergies.map((allergy, i) => (
                                    <li key={i} className="allergy">{allergy}</li>
                                ))}
                            </ul>
                        </Card>

                        <Card>
                            <h3>Previous Treatments</h3>
                            <ul className="clinical-list">
                                {patient.clinicalInfo.previousTreatments.map((treatment, i) => (
                                    <li key={i}>{treatment}</li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                )}

                {activeTab === 'sessions' && (
                    <div className="tab-content">
                        <div className="sessions-list">
                            {patient.sessions.map((session, i) => (
                                <Card key={i} className="session-card">
                                    <div className="session-header-row">
                                        <div>
                                            <h4>{session.type} Session</h4>
                                            <p className="session-date">{session.date} • {session.duration} minutes</p>
                                        </div>
                                        <Button variant="ghost" size="sm">View Full Notes</Button>
                                    </div>
                                    <p className="session-notes">{session.notes}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'mood' && (
                    <div className="tab-content">
                        <Card>
                            <h3>Recent Mood Entries</h3>
                            <div className="mood-timeline">
                                {patient.moodHistory.map((entry, i) => (
                                    <div key={i} className="mood-entry">
                                        <div className="mood-date">{entry.date}</div>
                                        <div className="mood-indicator-row">
                                            <div className="mood-dots">
                                                {[1, 2, 3, 4, 5].map(level => (
                                                    <div
                                                        key={level}
                                                        className={`mood-dot ${level <= entry.mood ? 'filled' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="mood-score">{entry.mood}/5</span>
                                        </div>
                                        {entry.notes && <p className="mood-notes">{entry.notes}</p>}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'assessments' && (
                    <div className="tab-content">
                        <div className="assessments-list">
                            {patient.assessments.map((assessment, i) => (
                                <Card key={i} className="assessment-card">
                                    <div className="assessment-header-row">
                                        <div>
                                            <h4>{assessment.type}</h4>
                                            <p className="assessment-date">{assessment.date}</p>
                                        </div>
                                        <div className="assessment-score-badge">
                                            Score: {assessment.score}
                                        </div>
                                    </div>
                                    <div className="assessment-details">
                                        <span className={`severity severity-${assessment.severity.toLowerCase().replace(' ', '-')}`}>
                                            {assessment.severity}
                                        </span>
                                        <span className="trend">Trend: {assessment.trend}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'treatment' && (
                    <div className="tab-content">
                        <Card>
                            <h3>Treatment Goals</h3>
                            <ul className="goals-list">
                                {patient.treatmentPlan.goals.map((goal, i) => (
                                    <li key={i}>
                                        <span className="goal-icon">🎯</span>
                                        {goal}
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card>
                            <h3>Interventions</h3>
                            <ul className="interventions-list">
                                {patient.treatmentPlan.interventions.map((intervention, i) => (
                                    <li key={i}>{intervention}</li>
                                ))}
                            </ul>
                        </Card>

                        <Card>
                            <h3>Overall Progress</h3>
                            <div className="progress-bar-container">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${patient.treatmentPlan.progress}%` }}
                                    />
                                </div>
                                <span className="progress-text">{patient.treatmentPlan.progress}% Complete</span>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};
