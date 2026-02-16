import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientCard.css';

interface Patient {
    id: number;
    name: string;
    age: number;
    lastSession: string;
    nextSession?: string;
    riskLevel: 'low' | 'medium' | 'high';
    currentMood: number; // 1-5
    engagement: 'active' | 'moderate' | 'low';
}

interface PatientCardProps {
    patient: Patient;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
    const navigate = useNavigate();

    const getMoodColor = (mood: number) => {
        if (mood >= 4) return '#10b981';
        if (mood >= 3) return '#f59e0b';
        return '#ef4444';
    };

    const getRiskBadgeClass = (level: string) => {
        return `risk-badge risk-${level}`;
    };

    return (
        <div className="patient-card" onClick={() => navigate(`/therapist/patient/${patient.id}`)}>
            <div className="patient-header">
                <div className="patient-avatar">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="patient-info">
                    <h4>{patient.name}</h4>
                    <p className="patient-age">{patient.age} years old</p>
                </div>
                {patient.riskLevel !== 'low' && (
                    <span className={getRiskBadgeClass(patient.riskLevel)}>
                        {patient.riskLevel}
                    </span>
                )}
            </div>

            <div className="patient-stats">
                <div className="stat-item">
                    <span className="stat-label">Current Mood</span>
                    <div className="mood-indicator-small">
                        <span
                            className="mood-dot"
                            style={{ backgroundColor: getMoodColor(patient.currentMood) }}
                        />
                        <span className="mood-value">{patient.currentMood}/5</span>
                    </div>
                </div>

                <div className="stat-item">
                    <span className="stat-label">Engagement</span>
                    <span className={`engagement-badge engagement-${patient.engagement}`}>
                        {patient.engagement}
                    </span>
                </div>
            </div>

            <div className="patient-sessions">
                <div className="session-info">
                    <span className="session-label">Last Session</span>
                    <span className="session-date">{patient.lastSession}</span>
                </div>
                {patient.nextSession && (
                    <div className="session-info">
                        <span className="session-label">Next Session</span>
                        <span className="session-date next">{patient.nextSession}</span>
                    </div>
                )}
            </div>

            <div className="patient-actions">
                <button className="action-btn" onClick={(e) => { e.stopPropagation(); alert('View profile'); }}>
                    View Profile
                </button>
                <button className="action-btn" onClick={(e) => { e.stopPropagation(); alert('New session'); }}>
                    New Session
                </button>
            </div>
        </div>
    );
};
