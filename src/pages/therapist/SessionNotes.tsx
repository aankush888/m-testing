import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { AIInsightsPanel, type AIInsight } from '../../components/AIInsightsPanel';
import './SessionNotes.css';

export const SessionNotes: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [selectedPatient, setSelectedPatient] = useState<string>('Sarah Johnson');
    const [sessionType, setSessionType] = useState<string>('followup');
    const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState(50);
    const [notes, setNotes] = useState('');
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

    const patients = ['Sarah Johnson', 'John Smith', 'Emily Davis', 'Michael Brown'];

    const handleTranscriptionComplete = (text: string) => {
        setNotes(text);

        // Generate AI insights based on the notes
        setTimeout(() => {
            const insights: AIInsight[] = [
                {
                    id: '1',
                    type: 'info',
                    category: 'theme',
                    title: 'Improved Sleep Patterns Detected',
                    description: 'Patient mentioned better sleep quality. This aligns with previous treatment goals.',
                    confidence: 85,
                    reasoning: 'Keywords: "sleep patterns have improved", "feeling more stable" indicate positive progress in sleep hygiene interventions.',
                },
                {
                    id: '2',
                    type: 'warning',
                    category: 'risk',
                    title: 'Work-Related Stress Mentioned',
                    description: 'Patient discussed work-related stress. Monitor for escalation.',
                    confidence: 72,
                    reasoning: 'Phrase "work-related stress" detected. Previous sessions indicated workplace anxiety triggers.',
                },
                {
                    id: '3',
                    type: 'info',
                    category: 'intervention',
                    title: 'Suggested Intervention: Continue Journaling',
                    description: 'Patient is engaging well with journaling exercises. Recommend continuing this practice.',
                    confidence: 90,
                    reasoning: 'Positive engagement with behavioral activation assignment. High compliance with journaling.',
                },
                {
                    id: '4',
                    type: 'info',
                    category: 'followup',
                    title: 'Follow-up on Coping Strategies',
                    description: 'Suggested follow-up: Review effectiveness of stress management techniques in next session.',
                    confidence: 78,
                    reasoning: 'Coping strategies were discussed. Recommend assessment of implementation and effectiveness.',
                },
            ];
            setAiInsights(insights);
        }, 1000);
    };

    const handleApproveInsight = (insightId: string) => {
        setAiInsights(insights =>
            insights.map(insight =>
                insight.id === insightId ? { ...insight, approved: true } : insight
            )
        );
    };

    const handleDismissInsight = (insightId: string) => {
        setAiInsights(insights => insights.filter(insight => insight.id !== insightId));
    };

    const handleSaveSession = () => {
        alert('Session notes saved successfully! In a real app, this would save to the database.');
        navigate('/therapist/dashboard');
    };

    return (
        <div className="session-notes-page">
            <div className="session-header">
                <div>
                    <Button variant="ghost" onClick={() => navigate('/therapist/dashboard')}>
                        ← Back to Dashboard
                    </Button>
                    <h1>Session Documentation</h1>
                </div>
                <Button variant="ghost" onClick={logout}>
                    Logout
                </Button>
            </div>

            <div className="session-layout">
                <div className="session-main">
                    <Card className="session-form">
                        <h2>Session Details</h2>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="patient">Patient</label>
                                <select
                                    id="patient"
                                    value={selectedPatient}
                                    onChange={(e) => setSelectedPatient(e.target.value)}
                                >
                                    {patients.map(patient => (
                                        <option key={patient} value={patient}>{patient}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="sessionType">Session Type</label>
                                <select
                                    id="sessionType"
                                    value={sessionType}
                                    onChange={(e) => setSessionType(e.target.value)}
                                >
                                    <option value="initial">Initial Consultation</option>
                                    <option value="followup">Follow-up</option>
                                    <option value="crisis">Crisis Intervention</option>
                                    <option value="assessment">Assessment</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">Session Date</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={sessionDate}
                                    onChange={(e) => setSessionDate(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="duration">Duration (minutes)</label>
                                <input
                                    id="duration"
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    min="15"
                                    max="120"
                                    step="5"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="voice-recording-card">
                        <h3>📝 Session Notes</h3>
                        <p className="card-subtitle">Use voice-to-text or type your session notes</p>

                        <VoiceRecorder
                            onTranscriptionComplete={handleTranscriptionComplete}
                            placeholder="Session notes will appear here..."
                        />

                        {!notes && (
                            <div className="manual-notes">
                                <label htmlFor="manual-notes">Or type notes manually:</label>
                                <textarea
                                    id="manual-notes"
                                    rows={10}
                                    placeholder="Enter session notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        )}
                    </Card>

                    <div className="session-actions">
                        <Button variant="secondary" onClick={() => navigate('/therapist/dashboard')}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveSession} disabled={!notes}>
                            💾 Save Session
                        </Button>
                    </div>
                </div>

                <div className="session-sidebar">
                    <AIInsightsPanel
                        insights={aiInsights}
                        onApprove={handleApproveInsight}
                        onDismiss={handleDismissInsight}
                    />
                </div>
            </div>
        </div>
    );
};
