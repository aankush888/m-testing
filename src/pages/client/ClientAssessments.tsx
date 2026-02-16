import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ClientAssessments.css';

interface Question {
    id: number;
    text: string;
    options: string[];
}

interface Assessment {
    id: string;
    type: 'PHQ-9' | 'GAD-7';
    title: string;
    description: string;
    questions: Question[];
    assignedDate: string;
    dueDate: string;
    status: 'pending' | 'completed';
    score?: number;
    severity?: string;
}

interface CompletedAssessment {
    date: string;
    score: number;
    type: string;
}

export const ClientAssessments: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
    const [responses, setResponses] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState<'list' | 'assessment' | 'results'>('list');

    // Mock data
    const [assessments, setAssessments] = useState<Assessment[]>([
        {
            id: '1',
            type: 'PHQ-9',
            title: 'Depression Screening (PHQ-9)',
            description: 'Patient Health Questionnaire - 9 items',
            assignedDate: '2024-02-10',
            dueDate: '2024-02-20',
            status: 'pending',
            questions: [
                { id: 1, text: 'Little interest or pleasure in doing things', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 2, text: 'Feeling down, depressed, or hopeless', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 3, text: 'Trouble falling or staying asleep, or sleeping too much', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 4, text: 'Feeling tired or having little energy', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 5, text: 'Poor appetite or overeating', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 6, text: 'Feeling bad about yourself or that you are a failure', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 7, text: 'Trouble concentrating on things', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 8, text: 'Moving or speaking slowly, or being fidgety or restless', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 9, text: 'Thoughts that you would be better off dead', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            ],
        },
        {
            id: '2',
            type: 'GAD-7',
            title: 'Anxiety Screening (GAD-7)',
            description: 'Generalized Anxiety Disorder - 7 items',
            assignedDate: '2024-02-12',
            dueDate: '2024-02-22',
            status: 'completed',
            score: 8,
            severity: 'Mild',
            questions: [
                { id: 1, text: 'Feeling nervous, anxious, or on edge', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 2, text: 'Not being able to stop or control worrying', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 3, text: 'Worrying too much about different things', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 4, text: 'Trouble relaxing', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 5, text: 'Being so restless that it is hard to sit still', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 6, text: 'Becoming easily annoyed or irritable', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
                { id: 7, text: 'Feeling afraid as if something awful might happen', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            ],
        },
    ]);

    const completedHistory: CompletedAssessment[] = [
        { date: '2024-02-12', score: 8, type: 'GAD-7' },
        { date: '2024-01-15', score: 12, type: 'GAD-7' },
        { date: '2023-12-10', score: 14, type: 'GAD-7' },
    ];

    const startAssessment = (assessment: Assessment) => {
        setActiveAssessment(assessment);
        setResponses(new Array(assessment.questions.length).fill(-1));
        setCurrentPage('assessment');
    };

    const handleResponse = (questionIndex: number, optionIndex: number) => {
        const newResponses = [...responses];
        newResponses[questionIndex] = optionIndex;
        setResponses(newResponses);
    };

    const calculateScore = () => {
        return responses.reduce((sum, score) => sum + score, 0);
    };

    const getSeverity = (score: number, type: string) => {
        if (type === 'PHQ-9') {
            if (score <= 4) return 'Minimal';
            if (score <= 9) return 'Mild';
            if (score <= 14) return 'Moderate';
            if (score <= 19) return 'Moderately Severe';
            return 'Severe';
        } else if (type === 'GAD-7') {
            if (score <= 4) return 'Minimal';
            if (score <= 9) return 'Mild';
            if (score <= 14) return 'Moderate';
            return 'Severe';
        }
        return 'Unknown';
    };

    const submitAssessment = () => {
        if (activeAssessment && !responses.includes(-1)) {
            const score = calculateScore();
            const severity = getSeverity(score, activeAssessment.type);

            // Update assessment
            setAssessments(assessments.map(a =>
                a.id === activeAssessment.id
                    ? { ...a, status: 'completed', score, severity }
                    : a
            ));

            setActiveAssessment({ ...activeAssessment, score, severity });
            setCurrentPage('results');
        } else {
            alert('Please answer all questions before submitting.');
        }
    };

    const backToList = () => {
        setCurrentPage('list');
        setActiveAssessment(null);
        setResponses([]);
    };

    const isComplete = !responses.includes(-1);
    const progress = ((responses.filter(r => r !== -1).length / responses.length) * 100).toFixed(0);

    return (
        <div className="assessments-page">
            <div className="assessments-header">
                <div>
                    <Button variant="ghost" onClick={() => navigate('/client/dashboard')}>
                        ← Back to Dashboard
                    </Button>
                    <h1>My Assessments</h1>
                    <p>Complete questionnaires assigned by your therapist</p>
                </div>
                <Button variant="ghost" onClick={logout}>
                    Logout
                </Button>
            </div>

            {currentPage === 'list' && (
                <div className="assessments-content">
                    <div className="assessments-grid">
                        <div className="assigned-assessments">
                            <h2>Assigned Assessments</h2>
                            {assessments.map(assessment => (
                                <Card key={assessment.id} className={`assessment-item ${assessment.status}`}>
                                    <div className="assessment-header-row">
                                        <div className="assessment-info">
                                            <h3>{assessment.title}</h3>
                                            <p className="assessment-description">{assessment.description}</p>
                                            <div className="assessment-meta">
                                                <span>Assigned: {assessment.assignedDate}</span>
                                                <span>Due: {assessment.dueDate}</span>
                                            </div>
                                        </div>
                                        <div className="assessment-status-badge">
                                            {assessment.status === 'completed' ? (
                                                <div className="status-completed">
                                                    <span className="status-icon">✓</span>
                                                    <span>Completed</span>
                                                    {assessment.score !== undefined && (
                                                        <div className="score-badge">
                                                            Score: {assessment.score}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="status-pending">
                                                    <span className="status-icon">⏳</span>
                                                    <span>Pending</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {assessment.status === 'pending' && (
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            onClick={() => startAssessment(assessment)}
                                        >
                                            Start Assessment
                                        </Button>
                                    )}
                                    {assessment.status === 'completed' && assessment.severity && (
                                        <div className="severity-indicator">
                                            <span className={`severity-badge severity-${assessment.severity.toLowerCase().replace(' ', '-')}`}>
                                                {assessment.severity}
                                            </span>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>

                        {completedHistory.length > 0 && (
                            <Card className="history-card">
                                <h3>Progress Over Time</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={completedHistory.reverse()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="date" stroke="#6b7280" />
                                        <YAxis domain={[0, 21]} stroke="#6b7280" />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#0ea5e9"
                                            strokeWidth={3}
                                            dot={{ fill: '#0ea5e9', r: 5 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                        )}
                    </div>
                </div>
            )}

            {currentPage === 'assessment' && activeAssessment && (
                <div className="assessment-taking">
                    <Card className="assessment-card">
                        <div className="assessment-progress">
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="progress-text">{progress}% Complete</span>
                        </div>

                        <h2>{activeAssessment.title}</h2>
                        <p className="assessment-instructions">
                            Over the last 2 weeks, how often have you been bothered by the following?
                        </p>

                        <div className="questions-list">
                            {activeAssessment.questions.map((question, qIndex) => (
                                <div key={question.id} className="question-block">
                                    <h4>Question {question.id}</h4>
                                    <p className="question-text">{question.text}</p>
                                    <div className="options-grid">
                                        {question.options.map((option, oIndex) => (
                                            <button
                                                key={oIndex}
                                                className={`option-button ${responses[qIndex] === oIndex ? 'selected' : ''}`}
                                                onClick={() => handleResponse(qIndex, oIndex)}
                                            >
                                                <span className="option-score">{oIndex}</span>
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="assessment-actions">
                            <Button variant="secondary" onClick={backToList}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={submitAssessment}
                                disabled={!isComplete}
                            >
                                Submit Assessment
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {currentPage === 'results' && activeAssessment && (
                <div className="results-page">
                    <Card className="results-card">
                        <div className="results-icon">✓</div>
                        <h2>Assessment Complete</h2>
                        <p className="results-subtitle">Thank you for completing {activeAssessment.title}</p>

                        <div className="results-score">
                            <div className="score-display">
                                <span className="score-number">{activeAssessment.score}</span>
                                <span className="score-label">Total Score</span>
                            </div>
                            <div className={`severity-display severity-${activeAssessment.severity?.toLowerCase().replace(' ', '-')}`}>
                                {activeAssessment.severity}
                            </div>
                        </div>

                        <div className="results-message">
                            <p>Your responses have been recorded and your therapist will review them during your next session.</p>
                            <p>Remember, these results are just one part of understanding your mental health. Your therapist will discuss them with you.</p>
                        </div>

                        <Button variant="primary" onClick={backToList}>
                            Back to Assessments
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
};
