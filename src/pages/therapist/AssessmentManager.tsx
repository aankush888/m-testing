import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AssessmentManager.css';

interface AssessmentTemplate {
    id: string;
    name: string;
    type: 'PHQ-9' | 'GAD-7' | 'PTSD' | 'Custom';
    description: string;
    questionCount: number;
}

interface PatientAssessment {
    id: string;
    patientId: number;
    patientName: string;
    assessmentType: string;
    assignedDate: string;
    dueDate: string;
    status: 'pending' | 'completed';
    score?: number;
    severity?: string;
}

interface Patient {
    id: number;
    name: string;
}

export const AssessmentManager: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [selectedTemplate, setSelectedTemplate] = useState<AssessmentTemplate | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
    const [dueDate, setDueDate] = useState('');
    const [viewMode, setViewMode] = useState<'assign' | 'results'>('assign');

    // Mock data
    const templates: AssessmentTemplate[] = [
        { id: 'phq9', name: 'PHQ-9', type: 'PHQ-9', description: 'Patient Health Questionnaire (Depression)', questionCount: 9 },
        { id: 'gad7', name: 'GAD-7', type: 'GAD-7', description: 'Generalized Anxiety Disorder Assessment', questionCount: 7 },
        { id: 'ptsd', name: 'PCL-5', type: 'PTSD', description: 'PTSD Checklist for DSM-5', questionCount: 20 },
    ];

    const patients: Patient[] = [
        { id: 1, name: 'Sarah Johnson' },
        { id: 2, name: 'Michael Chen' },
        { id: 3, name: 'Emily Rodriguez' },
        { id: 4, name: 'David Kim' },
    ];

    const [assignedAssessments, setAssignedAssessments] = useState<PatientAssessment[]>([
        { id: '1', patientId: 1, patientName: 'Sarah Johnson', assessmentType: 'GAD-7', assignedDate: '2024-02-10', dueDate: '2024-02-20', status: 'completed', score: 8, severity: 'Mild' },
        { id: '2', patientId: 1, patientName: 'Sarah Johnson', assessmentType: 'PHQ-9', assignedDate: '2024-01-15', dueDate: '2024-01-25', status: 'completed', score: 12, severity: 'Moderate' },
        { id: '3', patientId: 2, patientName: 'Michael Chen', assessmentType: 'PHQ-9', assignedDate: '2024-02-12', dueDate: '2024-02-22', status: 'pending' },
        { id: '4', patientId: 3, patientName: 'Emily Rodriguez', assessmentType: 'GAD-7', assignedDate: '2024-02-08', dueDate: '2024-02-18', status: 'completed', score: 15, severity: 'Moderate' },
    ]);

    const scoreHistory = [
        { date: '2023-12-01', score: 14 },
        { date: '2024-01-15', score: 12 },
        { date: '2024-02-10', score: 8 },
    ];

    const handleAssign = () => {
        if (selectedTemplate && selectedPatient && dueDate) {
            const patient = patients.find(p => p.id === selectedPatient);
            const newAssignment: PatientAssessment = {
                id: Date.now().toString(),
                patientId: selectedPatient,
                patientName: patient?.name || '',
                assessmentType: selectedTemplate.name,
                assignedDate: new Date().toISOString().split('T')[0],
                dueDate,
                status: 'pending',
            };
            setAssignedAssessments([newAssignment, ...assignedAssessments]);
            alert(`${selectedTemplate.name} assigned to ${patient?.name}`);

            // Reset form
            setSelectedTemplate(null);
            setSelectedPatient(null);
            setDueDate('');
        } else {
            alert('Please select an assessment, patient, and due date');
        }
    };

    const completedAssessments = assignedAssessments.filter(a => a.status === 'completed');
    const pendingAssessments = assignedAssessments.filter(a => a.status === 'pending');

    return (
        <div className="assessment-manager-page">
            <div className="manager-header">
                <div>
                    <Button variant="ghost" onClick={() => navigate('/therapist/dashboard')}>
                        ← Back to Dashboard
                    </Button>
                    <h1>Assessment Manager</h1>
                    <p>Assign and track patient assessments</p>
                </div>
                <Button variant="ghost" onClick={logout}>
                    Logout
                </Button>
            </div>

            <div className="manager-tabs">
                <button
                    className={`tab-btn ${viewMode === 'assign' ? 'active' : ''}`}
                    onClick={() => setViewMode('assign')}
                >
                    📋 Assign Assessment
                </button>
                <button
                    className={`tab-btn ${viewMode === 'results' ? 'active' : ''}`}
                    onClick={() => setViewMode('results')}
                >
                    📊 View Results
                </button>
            </div>

            {viewMode === 'assign' && (
                <div className="manager-content">
                    <div className="assignment-layout">
                        <Card className="library-card">
                            <h3>Assessment Library</h3>
                            <p className="card-subtitle">Select an assessment to assign</p>
                            <div className="templates-list">
                                {templates.map(template => (
                                    <button
                                        key={template.id}
                                        className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedTemplate(template)}
                                    >
                                        <div className="template-header">
                                            <h4>{template.name}</h4>
                                            <span className="question-count">{template.questionCount} questions</span>
                                        </div>
                                        <p className="template-description">{template.description}</p>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <Card className="assignment-card">
                            <h3>Assign to Patient</h3>
                            {selectedTemplate ? (
                                <div className="assignment-form">
                                    <div className="selected-assessment">
                                        <span className="label">Selected Assessment:</span>
                                        <span className="value">{selectedTemplate.name}</span>
                                    </div>

                                    <div className="form-group">
                                        <label>Select Patient</label>
                                        <select
                                            value={selectedPatient || ''}
                                            onChange={(e) => setSelectedPatient(Number(e.target.value))}
                                            className="form-select"
                                        >
                                            <option value="">Choose a patient...</option>
                                            {patients.map(patient => (
                                                <option key={patient.id} value={patient.id}>
                                                    {patient.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Due Date</label>
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="form-input"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    <Button variant="primary" fullWidth onClick={handleAssign}>
                                        Assign Assessment
                                    </Button>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>👈 Select an assessment from the library to get started</p>
                                </div>
                            )}
                        </Card>
                    </div>

                    <Card className="recent-assignments">
                        <h3>Recent Assignments</h3>
                        <div className="assignments-table">
                            <div className="table-header">
                                <span>Patient</span>
                                <span>Assessment</span>
                                <span>Assigned</span>
                                <span>Due</span>
                                <span>Status</span>
                            </div>
                            {assignedAssessments.slice(0, 5).map(assignment => (
                                <div key={assignment.id} className="table-row">
                                    <span>{assignment.patientName}</span>
                                    <span>{assignment.assessmentType}</span>
                                    <span>{assignment.assignedDate}</span>
                                    <span>{assignment.dueDate}</span>
                                    <span className={`status-badge ${assignment.status}`}>
                                        {assignment.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {viewMode === 'results' && (
                <div className="manager-content">
                    <div className="results-grid">
                        <Card className="stats-overview">
                            <h3>Overview</h3>
                            <div className="stats-row">
                                <div className="stat-item">
                                    <span className="stat-value">{assignedAssessments.length}</span>
                                    <span className="stat-label">Total Assigned</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{completedAssessments.length}</span>
                                    <span className="stat-label">Completed</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{pendingAssessments.length}</span>
                                    <span className="stat-label">Pending</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="completed-assessments">
                            <h3>Completed Assessments</h3>
                            <div className="results-list">
                                {completedAssessments.map(assessment => (
                                    <div key={assessment.id} className="result-item">
                                        <div className="result-info">
                                            <h4>{assessment.patientName}</h4>
                                            <p>{assessment.assessmentType} • {assessment.assignedDate}</p>
                                        </div>
                                        <div className="result-score">
                                            <span className="score-number">{assessment.score}</span>
                                            <span className={`severity-badge severity-${assessment.severity?.toLowerCase()}`}>
                                                {assessment.severity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="score-trend">
                            <h3>Score Trend - Sarah Johnson (GAD-7)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={scoreHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="date" stroke="#6b7280" />
                                    <YAxis domain={[0, 21]} stroke="#6b7280" />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#0ea5e9"
                                        strokeWidth={3}
                                        dot={{ fill: '#0ea5e9', r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};
