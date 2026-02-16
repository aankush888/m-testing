import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import './MoodCheckIn.css';

const MOODS = [
    { value: 1, emoji: '😢', label: 'Struggling' },
    { value: 2, emoji: '😔', label: 'Not Great' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😄', label: 'Great' },
];

const CONTEXT_PROMPTS = [
    'What led to this feeling?',
    'Any specific trigger?',
    'What would help right now?',
    'Is there something on your mind?',
];

export const MoodCheckIn: React.FC = () => {
    const [mood, setMood] = useState<number | null>(null);
    const [intensity, setIntensity] = useState(5);
    const [context, setContext] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { addMoodEntry, moodEntries } = useData();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mood) return;

        addMoodEntry({ mood, intensity, context });
        setSubmitted(true);
    };

    if (submitted) {
        const entry = moodEntries[0];
        return (
            <div className="mood-check-in">
                <div className="mood-container">
                    <Card className="mood-card">
                        <div className="mood-success">
                            <div className="success-icon">✓</div>
                            <h2>Thank You for Checking In</h2>

                            <div className="ai-feedback-box">
                                <p className="ai-feedback">{entry.aiFeedback}</p>
                            </div>

                            {entry.suggestedActivity && (
                                <div className="suggested-activity-box">
                                    <h4>Suggested Activity</h4>
                                    <p>{entry.suggestedActivity}</p>
                                </div>
                            )}

                            <div className="mood-actions">
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => navigate('/client/journal')}
                                >
                                    ✍️ Write in Journal
                                </Button>
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => navigate('/client/dashboard')}
                                >
                                    Back to Dashboard
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="mood-check-in">
            <div className="mood-container">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/client/dashboard')}
                    className="back-button"
                >
                    ← Back
                </Button>

                <Card className="mood-card">
                    <h2>How are you feeling?</h2>
                    <p className="mood-subtitle">Your feelings matter. There's no right answer.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mood-selection">
                            {MOODS.map((m) => (
                                <button
                                    key={m.value}
                                    type="button"
                                    className={`mood-option ${mood === m.value ? 'selected' : ''}`}
                                    onClick={() => setMood(m.value)}
                                >
                                    <span className="mood-emoji-big">{m.emoji}</span>
                                    <span className="mood-label">{m.label}</span>
                                </button>
                            ))}
                        </div>

                        {mood && (
                            <div className="mood-intensity animate-fade-in">
                                <label htmlFor="intensity">
                                    How intense is this feeling? ({intensity}/10)
                                </label>
                                <input
                                    id="intensity"
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={intensity}
                                    onChange={(e) => setIntensity(Number(e.target.value))}
                                    className="intensity-slider"
                                />
                                <div className="intensity-labels">
                                    <span>Mild</span>
                                    <span>Intense</span>
                                </div>
                            </div>
                        )}

                        {mood && (
                            <div className="mood-context animate-fade-in">
                                <label htmlFor="context">
                                    {CONTEXT_PROMPTS[Math.floor(Math.random() * CONTEXT_PROMPTS.length)]} (Optional)
                                </label>
                                <textarea
                                    id="context"
                                    rows={4}
                                    placeholder="Share what's on your mind..."
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                />
                            </div>
                        )}

                        {mood && (
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                className="animate-fade-in"
                            >
                                Submit Check-In
                            </Button>
                        )}
                    </form>

                    <div className="mood-reassurance">
                        <p className="text-sm">
                            🔒 This information is private and only shared with your therapist if you choose to.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
