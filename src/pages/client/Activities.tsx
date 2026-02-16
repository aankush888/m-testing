import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import './Activities.css';

type ActivityType = 'breathing' | 'meditation' | 'grounding';
type BreathingType = 'box' | '478' | null;

interface ActivityLog {
    id: string;
    type: ActivityType;
    name: string;
    duration: number;
    timestamp: Date;
    moodBefore?: number;
    moodAfter?: number;
}

export const Activities: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [activeActivity, setActiveActivity] = useState<ActivityType | null>(null);
    const [breathingType, setBreathingType] = useState<BreathingType>(null);
    const [meditationDuration, setMeditationDuration] = useState<number>(5);
    const [isActive, setIsActive] = useState(false);
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

    // Breathing exercise timer
    useEffect(() => {
        if (isActive && breathingType) {
            const timings = breathingType === 'box'
                ? { inhale: 4, hold: 4, exhale: 4, pause: 4 }
                : { inhale: 4, hold: 7, exhale: 8, pause: 0 };

            const interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 0) {
                        // Move to next phase
                        if (breathPhase === 'inhale') {
                            setBreathPhase('hold');
                            return timings.hold;
                        } else if (breathPhase === 'hold') {
                            setBreathPhase('exhale');
                            return timings.exhale;
                        } else if (breathPhase === 'exhale') {
                            if (timings.pause > 0) {
                                setBreathPhase('pause');
                                return timings.pause;
                            } else {
                                setBreathPhase('inhale');
                                return timings.inhale;
                            }
                        } else {
                            setBreathPhase('inhale');
                            return timings.inhale;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isActive, breathingType, breathPhase]);

    // Meditation timer
    useEffect(() => {
        if (isActive && activeActivity === 'meditation' && timeRemaining > 0) {
            const interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsActive(false);
                        alert('Meditation session complete! 🧘');
                        logActivity('Meditation', meditationDuration);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isActive, activeActivity, timeRemaining]);

    const startBreathingExercise = (type: BreathingType) => {
        setBreathingType(type);
        setActiveActivity('breathing');
        setIsActive(true);
        setBreathPhase('inhale');
        setTimeRemaining(4);
    };

    const startMeditation = (duration: number) => {
        setMeditationDuration(duration);
        setActiveActivity('meditation');
        setTimeRemaining(duration * 60);
        setIsActive(true);
    };

    const stopActivity = () => {
        if (activeActivity === 'breathing' && breathingType) {
            const name = breathingType === 'box' ? 'Box Breathing' : '4-7-8 Breathing';
            logActivity(name, 1);
        }
        setIsActive(false);
        setActiveActivity(null);
        setBreathingType(null);
    };

    const logActivity = (name: string, duration: number) => {
        const newLog: ActivityLog = {
            id: Date.now().toString(),
            type: activeActivity || 'breathing',
            name,
            duration,
            timestamp: new Date(),
        };
        setActivityLogs([newLog, ...activityLogs]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getBreathingInstruction = () => {
        switch (breathPhase) {
            case 'inhale': return 'Breathe In';
            case 'hold': return 'Hold';
            case 'exhale': return 'Breathe Out';
            case 'pause': return 'Pause';
        }
    };

    return (
        <div className="activities-page">
            <div className="activities-header">
                <div>
                    <Button variant="ghost" onClick={() => navigate('/client/dashboard')}>
                        ← Back to Dashboard
                    </Button>
                    <h1>Self-Care Activities</h1>
                    <p>Guided exercises for relaxation and mindfulness</p>
                </div>
                <Button variant="ghost" onClick={logout}>
                    Logout
                </Button>
            </div>

            {!activeActivity && (
                <div className="activities-content">
                    <div className="activities-grid">
                        <Card className="activity-category-card">
                            <div className="activity-icon breathing">🫁</div>
                            <h3>Breathing Exercises</h3>
                            <p>Calming breath work to reduce stress and anxiety</p>
                            <div className="activity-buttons">
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => startBreathingExercise('box')}
                                >
                                    Box Breathing (4-4-4-4)
                                </Button>
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => startBreathingExercise('478')}
                                >
                                    4-7-8 Technique
                                </Button>
                            </div>
                        </Card>

                        <Card className="activity-category-card">
                            <div className="activity-icon meditation">🧘</div>
                            <h3>Meditation</h3>
                            <p>Guided meditation with customizable duration</p>
                            <div className="activity-buttons">
                                <Button variant="primary" fullWidth onClick={() => startMeditation(5)}>
                                    5 Minutes
                                </Button>
                                <Button variant="secondary" fullWidth onClick={() => startMeditation(10)}>
                                    10 Minutes
                                </Button>
                                <Button variant="secondary" fullWidth onClick={() => startMeditation(15)}>
                                    15 Minutes
                                </Button>
                            </div>
                        </Card>

                        <Card className="activity-category-card">
                            <div className="activity-icon grounding">🌿</div>
                            <h3>Grounding Techniques</h3>
                            <p>5-4-3-2-1 technique to stay present</p>
                            <div className="grounding-guide">
                                <div className="grounding-step">
                                    <strong>5</strong> things you can see
                                </div>
                                <div className="grounding-step">
                                    <strong>4</strong> things you can touch
                                </div>
                                <div className="grounding-step">
                                    <strong>3</strong> things you can hear
                                </div>
                                <div className="grounding-step">
                                    <strong>2</strong> things you can smell
                                </div>
                                <div className="grounding-step">
                                    <strong>1</strong> thing you can taste
                                </div>
                            </div>
                        </Card>
                    </div>

                    {activityLogs.length > 0 && (
                        <Card className="activity-log-card">
                            <h3>Recent Activity</h3>
                            <div className="activity-log-list">
                                {activityLogs.slice(0, 5).map(log => (
                                    <div key={log.id} className="activity-log-item">
                                        <div className="log-icon">
                                            {log.type === 'breathing' && '🫁'}
                                            {log.type === 'meditation' && '🧘'}
                                            {log.type === 'grounding' && '🌿'}
                                        </div>
                                        <div className="log-details">
                                            <strong>{log.name}</strong>
                                            <span className="log-meta">
                                                {log.duration} min • {new Date(log.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {activeActivity === 'breathing' && isActive && (
                <div className="breathing-exercise-container">
                    <Card className="breathing-card">
                        <h2>{breathingType === 'box' ? 'Box Breathing' : '4-7-8 Breathing'}</h2>
                        <p className="breathing-subtitle">Follow the circle and breathe</p>

                        <div className="breathing-visualization">
                            <div className={`breathing-circle ${breathPhase}`}>
                                <span className="breath-count">{timeRemaining}</span>
                            </div>
                        </div>

                        <div className="breathing-instruction">
                            <h3>{getBreathingInstruction()}</h3>
                        </div>

                        <Button variant="secondary" onClick={stopActivity}>
                            Complete Exercise
                        </Button>
                    </Card>
                </div>
            )}

            {activeActivity === 'meditation' && isActive && (
                <div className="meditation-container">
                    <Card className="meditation-card">
                        <h2>Meditation Session</h2>
                        <p className="meditation-subtitle">{meditationDuration} minute session</p>

                        <div className="meditation-timer">
                            <svg className="timer-ring" viewBox="0 0 200 200">
                                <circle
                                    className="timer-ring-background"
                                    cx="100"
                                    cy="100"
                                    r="90"
                                />
                                <circle
                                    className="timer-ring-progress"
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    style={{
                                        strokeDashoffset: 565.48 * (1 - (timeRemaining / (meditationDuration * 60)))
                                    }}
                                />
                            </svg>
                            <div className="timer-text">
                                <span className="timer-time">{formatTime(timeRemaining)}</span>
                                <span className="timer-label">remaining</span>
                            </div>
                        </div>

                        <div className="meditation-guidance">
                            <p>Find a comfortable position</p>
                            <p>Close your eyes and focus on your breath</p>
                            <p>Let thoughts pass without judgment</p>
                        </div>

                        <Button variant="secondary" onClick={stopActivity}>
                            End Session
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
};
