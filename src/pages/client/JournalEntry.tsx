import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import './JournalEntry.css';

const JOURNAL_PROMPTS = [
    'What are three things you\'re grateful for today?',
    'Describe a challenging moment and how you handled it.',
    'What would you tell a friend going through what you\'re experiencing?',
    'What emotions are you feeling right now, and why?',
    'What gave you energy today?',
    'What drained your energy today?',
    'What\'s one small win you had today?',
];

export const JournalEntry: React.FC = () => {
    const [content, setContent] = useState('');
    const [selectedPrompt, setSelectedPrompt] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { addJournalEntry, journalEntries } = useData();
    const navigate = useNavigate();

    const handlePromptClick = (prompt: string) => {
        setSelectedPrompt(prompt);
        if (content) {
            setContent(content + '\n\n' + prompt + '\n');
        } else {
            setContent(prompt + '\n');
        }
    };

    const handleVoiceRecord = () => {
        setIsRecording(!isRecording);
        // Simulate voice recording
        if (!isRecording) {
            setTimeout(() => {
                setIsRecording(false);
                alert('In a real app, this would transcribe your voice to text!');
            }, 3000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        addJournalEntry({ content, prompt: selectedPrompt });
        setSubmitted(true);
    };

    if (submitted) {
        const entry = journalEntries[0];
        return (
            <div className="journal-entry-page">
                <div className="journal-container">
                    <Card className="journal-card">
                        <div className="journal-success">
                            <div className="success-icon">✓</div>
                            <h2>Entry Saved</h2>

                            <div className="ai-response-box">
                                <h4>AI Response</h4>
                                <p>{entry.aiResponse}</p>
                            </div>

                            <div className="journal-stats">
                                <div className="stat">
                                    <span className="stat-value">{journalEntries.length}</span>
                                    <span className="stat-label">Total Entries</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{content.split(' ').length}</span>
                                    <span className="stat-label">Words Written</span>
                                </div>
                            </div>

                            <div className="journal-actions">
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => {
                                        setContent('');
                                        setSelectedPrompt('');
                                        setSubmitted(false);
                                    }}
                                >
                                    ✍️ Write Another Entry
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

    const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];

    return (
        <div className="journal-entry-page">
            <div className="journal-container">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/client/dashboard')}
                    className="back-button"
                >
                    ← Back
                </Button>

                <Card className="journal-card">
                    <h2>Your Journal</h2>
                    <p className="journal-subtitle">A safe space for your thoughts and feelings</p>

                    <div className="prompt-suggestion">
                        <p className="prompt-label">Need inspiration?</p>
                        <button
                            className="prompt-button"
                            onClick={() => handlePromptClick(randomPrompt)}
                        >
                            💡 {randomPrompt}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="journal-editor">
                            <div className="editor-toolbar">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleVoiceRecord}
                                    className={isRecording ? 'recording' : ''}
                                >
                                    {isRecording ? '⏺️ Recording...' : '🎤 Voice Input'}
                                </Button>
                                <span className="word-count">
                                    {content.split(' ').filter(w => w).length} words
                                </span>
                            </div>

                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write freely... Your thoughts are safe here."
                                rows={12}
                                className="journal-textarea"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            disabled={!content.trim()}
                        >
                            Save Entry
                        </Button>
                    </form>

                    <div className="journal-privacy">
                        <p className="text-sm">
                            🔒 Your journal is completely private. Entries are never shared unless you explicitly choose to.
                        </p>
                    </div>
                </Card>

                {journalEntries.length > 0 && (
                    <Card className="recent-entries">
                        <h3>Recent Entries</h3>
                        {journalEntries.slice(0, 3).map((entry) => (
                            <div key={entry.id} className="entry-preview">
                                <p className="entry-date">
                                    {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                                    {new Date(entry.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                                <p className="entry-snippet">
                                    {entry.content.substring(0, 100)}
                                    {entry.content.length > 100 ? '...' : ''}
                                </p>
                            </div>
                        ))}
                    </Card>
                )}
            </div>
        </div>
    );
};
