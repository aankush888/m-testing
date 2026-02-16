import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './ClientInsights.css';

const MOOD_LABELS = ['Struggling', 'Not Great', 'Okay', 'Good', 'Great'];

export const ClientInsights: React.FC = () => {
    const { moodEntries, journalEntries } = useData();
    const navigate = useNavigate();

    // Prepare chart data
    const last7Days = moodEntries.slice(0, 7).reverse();
    const chartData = last7Days.map((entry, index) => ({
        day: new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
        mood: entry.mood,
        intensity: entry.intensity,
    }));

    // Calculate stats
    const avgMood = moodEntries.length > 0
        ? (moodEntries.reduce((sum, e) => sum + e.mood, 0) / moodEntries.length).toFixed(1)
        : '0';

    const moodCounts = [0, 0, 0, 0, 0];
    moodEntries.forEach(e => moodCounts[e.mood - 1]++);
    const moodDistribution = moodCounts.map((count, index) => ({
        mood: MOOD_LABELS[index],
        count,
    }));

    const totalEntries = moodEntries.length + journalEntries.length;
    const currentStreak = calculateStreak();

    function calculateStreak(): number {
        // Simple streak calculation
        let streak = 0;
        const today = new Date().setHours(0, 0, 0, 0);
        const allEntries = [
            ...moodEntries.map(e => e.timestamp),
            ...journalEntries.map(e => e.timestamp),
        ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        for (let i = 0; i < allEntries.length; i++) {
            const entryDate = new Date(allEntries[i]).setHours(0, 0, 0, 0);
            const expectedDate = new Date(today - (i * 24 * 60 * 60 * 1000)).getTime();

            if (entryDate === expectedDate) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    return (
        <div className="client-insights">
            <div className="insights-container">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/client/dashboard')}
                    className="back-button"
                >
                    ← Back
                </Button>

                <div className="insights-header">
                    <h1>Your Insights</h1>
                    <p>Understanding your mental health journey</p>
                </div>

                <div className="insights-stats">
                    <Card className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-value">{avgMood}</div>
                        <div className="stat-label">Average Mood</div>
                        <div className="stat-sublabel">(1-5 scale)</div>
                    </Card>

                    <Card className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-value">{currentStreak}</div>
                        <div className="stat-label">Day Streak</div>
                        <div className="stat-sublabel">Keep it up!</div>
                    </Card>

                    <Card className="stat-card">
                        <div className="stat-icon">✍️</div>
                        <div className="stat-value">{totalEntries}</div>
                        <div className="stat-label">Total Entries</div>
                        <div className="stat-sublabel">Mood + Journal</div>
                    </Card>

                    <Card className="stat-card">
                        <div className="stat-icon">📝</div>
                        <div className="stat-value">{journalEntries.length}</div>
                        <div className="stat-label">Journal Entries</div>
                        <div className="stat-sublabel">This month</div>
                    </Card>
                </div>

                {chartData.length > 0 && (
                    <Card className="chart-card">
                        <h3>Mood Trend (Last 7 Days)</h3>
                        <p className="chart-subtitle">See how your mood has evolved over time</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <XAxis dataKey="day" stroke="#9ca3af" />
                                <YAxis domain={[0, 5]} stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="mood"
                                    stroke="#667eea"
                                    strokeWidth={3}
                                    dot={{ fill: '#667eea', r: 6 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="chart-legend">
                            <span>1 = Struggling</span>
                            <span>5 = Great</span>
                        </div>
                    </Card>
                )}

                {moodDistribution.length > 0 && (
                    <Card className="chart-card">
                        <h3>Mood Distribution</h3>
                        <p className="chart-subtitle">How often you experience different moods</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={moodDistribution}>
                                <XAxis dataKey="mood" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                                <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                )}

                <Card variant="glass" className="insights-message">
                    <h4>💙 Remember</h4>
                    <p>
                        These insights are here to help you understand yourself better, not to judge you.
                        Every emotion is valid, and tracking them is a sign of strength and self-awareness.
                    </p>
                </Card>
            </div>
        </div>
    );
};
