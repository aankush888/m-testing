import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import './Homework.css';

interface HomeworkItem {
    id: string;
    title: string;
    description: string;
    type: 'reading' | 'exercise' | 'thought-record' | 'practice' | 'custom';
    dueDate: string;
    completed: boolean;
    assignedBy: string;
    response?: string;
}

export const Homework: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [selectedHomework, setSelectedHomework] = useState<HomeworkItem | null>(null);
    const [response, setResponse] = useState('');

    // Mock homework data
    const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([
        {
            id: '1',
            title: 'Thought Record - Work Anxiety',
            description: 'Complete a thought record when you notice feelings of anxiety at work. Identify the situation, automatic thought, emotion, and evidence for/against the thought.',
            type: 'thought-record',
            dueDate: '2024-02-20',
            completed: false,
            assignedBy: 'Dr. Smith',
        },
        {
            id: '2',
            title: 'Progressive Muscle Relaxation',
            description: 'Practice PMR for 10 minutes daily. Notice which muscle groups hold the most tension.',
            type: 'practice',
            dueDate: '2024-02-18',
            completed: true,
            assignedBy: 'Dr. Smith',
            response: 'Practiced daily. Noticed most tension in shoulders and jaw. Feeling more relaxed.',
        },
        {
            id: '3',
            title: 'Read: Understanding Anxiety',
            description: 'Read Chapter 3 about the physiology of anxiety. Take notes on key points that resonate with you.',
            type: 'reading',
            dueDate: '2024-02-25',
            completed: false,
            assignedBy: 'Dr. Smith',
        },
        {
            id: '4',
            title: 'Daily Gratitude Journal',
            description: 'Write down 3 things you\'re grateful for each day this week.',
            type: 'exercise',
            dueDate: '2024-02-19',
            completed: false,
            assignedBy: 'Dr. Smith',
        },
    ]);

    const handleComplete = (id: string) => {
        setHomeworkList(homework =>
            homework.map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };

    const handleSubmitResponse = () => {
        if (selectedHomework && response) {
            setHomeworkList(homework =>
                homework.map(item =>
                    item.id === selectedHomework.id
                        ? { ...item, response, completed: true }
                        : item
                )
            );
            setSelectedHomework(null);
            setResponse('');
            alert('Response submitted successfully!');
        }
    };

    const getTypeIcon = (type: HomeworkItem['type']) => {
        switch (type) {
            case 'reading': return '📚';
            case 'exercise': return '💪';
            case 'thought-record': return '📝';
            case 'practice': return '🧘';
            case 'custom': return '📋';
        }
    };

    const getTypeLabel = (type: HomeworkItem['type']) => {
        return type.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date() && dueDate !== '';
    };

    const completedCount = homeworkList.filter(h => h.completed).length;
    const streakDays = 5; // Mock streak

    return (
        <div className="homework-page">
            <div className="homework-header">
                <div>
                    <Button variant="ghost" onClick={() => navigate('/client/dashboard')}>
                        ← Back to Dashboard
                    </Button>
                    <h1>My Homework</h1>
                    <p>Assignments from your therapist</p>
                </div>
                <Button variant="ghost" onClick={logout}>
                    Logout
                </Button>
            </div>

            <div className="homework-content">
                <div className="homework-stats">
                    <Card className="stat-card">
                        <div className="stat-icon">✓</div>
                        <div>
                            <h3>{completedCount}/{homeworkList.length}</h3>
                            <p>Completed</p>
                        </div>
                    </Card>

                    <Card className="stat-card">
                        <div className="stat-icon streak">🔥</div>
                        <div>
                            <h3>{streakDays} Days</h3>
                            <p>Current Streak</p>
                        </div>
                    </Card>
                </div>

                <div className="homework-list">
                    {homeworkList.map(homework => (
                        <Card
                            key={homework.id}
                            className={`homework-card ${homework.completed ? 'completed' : ''} ${isOverdue(homework.dueDate) && !homework.completed ? 'overdue' : ''
                                }`}
                        >
                            <div className="homework-card-header">
                                <div className="homework-type">
                                    <span className="type-icon">{getTypeIcon(homework.type)}</span>
                                    <span className="type-label">{getTypeLabel(homework.type)}</span>
                                </div>
                                <button
                                    className={`checkbox ${homework.completed ? 'checked' : ''}`}
                                    onClick={() => handleComplete(homework.id)}
                                >
                                    {homework.completed && '✓'}
                                </button>
                            </div>

                            <h3>{homework.title}</h3>
                            <p className="homework-description">{homework.description}</p>

                            <div className="homework-meta">
                                <span className="assigned-by">Assigned by: {homework.assignedBy}</span>
                                <span className={`due-date ${isOverdue(homework.dueDate) && !homework.completed ? 'overdue' : ''}`}>
                                    Due: {homework.dueDate}
                                </span>
                            </div>

                            {!homework.completed && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    fullWidth
                                    onClick={() => {
                                        setSelectedHomework(homework);
                                        setResponse(homework.response || '');
                                    }}
                                    className="mt-md"
                                >
                                    Submit Response
                                </Button>
                            )}

                            {homework.completed && homework.response && (
                                <div className="homework-response">
                                    <strong>Your Response:</strong>
                                    <p>{homework.response}</p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                {selectedHomework && (
                    <div className="response-modal-overlay" onClick={() => setSelectedHomework(null)}>
                        <Card className="response-modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Submit Response</h3>
                            <h4>{selectedHomework.title}</h4>
                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                placeholder="Share your thoughts, reflections, or completion notes..."
                                rows={8}
                            />
                            <div className="modal-actions">
                                <Button variant="secondary" onClick={() => setSelectedHomework(null)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleSubmitResponse}>
                                    Submit
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};
