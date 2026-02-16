import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import './ClientDashboard.css';

const MOOD_EMOJIS = ['😢', '😔', '😐', '🙂', '😄'];

export const ClientDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { moodEntries, journalEntries, getRecentMoodTrend } = useData();
    const navigate = useNavigate();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const latestMood = moodEntries[0];
    const recentTrend = getRecentMoodTrend();

    return (
        <div className="client-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>{getGreeting()}, {user?.name}!</h1>
                    <p>How are you feeling today?</p>
                </div>
                <Button variant="ghost" onClick={logout}>
                    Logout
                </Button>
            </div>

            <div className="dashboard-grid">
                <Card className="mood-quick-check">
                    <h3>Quick Mood Check-In</h3>
                    <p className="card-subtitle">Take a moment to share how you're feeling</p>
                    <div className="mood-selector">
                        {MOOD_EMOJIS.map((emoji, index) => (
                            <button
                                key={index}
                                className="mood-emoji"
                                onClick={() => navigate('/client/mood-check-in')}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => navigate('/client/mood-check-in')}
                        className="mt-md"
                    >
                        Full Check-In
                    </Button>
                </Card>

                {latestMood && (
                    <Card className="latest-mood">
                        <h3>Your Last Check-In</h3>
                        <div className="mood-display">
                            <span className="mood-emoji-large">
                                {MOOD_EMOJIS[latestMood.mood - 1]}
                            </span>
                            <div>
                                <p className="mood-time">
                                    {new Date(latestMood.timestamp).toLocaleString()}
                                </p>
                                <p className="mood-feedback">{latestMood.aiFeedback}</p>
                                {latestMood.suggestedActivity && (
                                    <p className="suggested-activity">{latestMood.suggestedActivity}</p>
                                )}
                            </div>
                        </div>
                    </Card>
                )}

                <Card className="journal-card">
                    <h3>Journal</h3>
                    <p className="card-subtitle">Express your thoughts and feelings</p>
                    {journalEntries.length > 0 ? (
                        <div className="journal-preview">
                            <p className="journal-count">
                                You have {journalEntries.length} journal{' '}
                                {journalEntries.length === 1 ? 'entry' : 'entries'}
                            </p>
                            <p className="journal-last">
                                Last entry: {new Date(journalEntries[0].timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <p>Start your journaling journey today</p>
                    )}
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/client/journal')}
                    >
                        ✍️ Write in Journal
                    </Button>
                </Card>

                <Card className="insights-card">
                    <h3>Your Insights</h3>
                    <p className="card-subtitle">See your mood patterns over time</p>
                    {recentTrend.length > 0 && (
                        <div className="mood-trend-mini">
                            {recentTrend.map((mood, i) => (
                                <span key={i} className="trend-dot" style={{
                                    backgroundColor: mood >= 4 ? '#10b981' : mood >= 3 ? '#f59e0b' : '#ef4444',
                                    height: `${mood * 10}px`,
                                }}></span>
                            ))}
                        </div>
                    )}
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/client/insights')}
                    >
                        📊 View Detailed Insights
                    </Button>
                </Card>

                <Card className="activities-card">
                    <h3>Self-Care Activities</h3>
                    <p className="card-subtitle">Breathing, meditation, and grounding exercises</p>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/client/activities')}
                    >
                        🧘 Start Activity
                    </Button>
                </Card>

                <Card className="homework-card">
                    <h3>My Homework</h3>
                    <p className="card-subtitle">Assignments from your therapist</p>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/client/homework')}
                    >
                        📚 View Homework
                    </Button>
                </Card>

                <Card className="assessments-card">
                    <h3>My Assessments</h3>
                    <p className="card-subtitle">Questionnaires from your therapist</p>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/client/assessments')}
                    >
                        📋 View Assessments
                    </Button>
                </Card>

                <Card className="settings-card">


                    <h3>Settings & Privacy</h3>
                    <p className="card-subtitle">Control who sees your data</p>
                    <Button
                        variant="ghost"
                        fullWidth
                        onClick={() => navigate('/client/settings')}
                    >
                        ⚙️ Manage Settings
                    </Button>
                </Card>

                <Card variant="glass" className="tip-card">
                    <h4>💡 Daily Tip</h4>
                    <p>
                        Small wins matter. Celebrate taking the time to check in with yourself today.
                    </p>
                </Card>
            </div>
        </div>
    );
};
