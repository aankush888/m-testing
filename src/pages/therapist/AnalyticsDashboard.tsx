import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AnalyticsDashboard.css';

export const AnalyticsDashboard: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Mock analytics data
    const practiceMetrics = {
        totalPatients: 24,
        activePatients: 18,
        avgEngagement: 78,
        sessionsThisMonth: 45,
        riskDistribution: {
            high: 3,
            medium: 5,
            low: 16,
        },
    };

    const engagementData = [
        { month: 'Jan', engagement: 65 },
        { month: 'Feb', engagement: 72 },
        { month: 'Mar', engagement: 68 },
        { month: 'Apr', engagement: 75 },
        { month: 'May', engagement: 78 },
        { month: 'Jun', engagement: 82 },
    ];

    const sessionTypesData = [
        { type: 'Follow-up', count: 28 },
        { type: 'Initial', count: 8 },
        { type: 'Crisis', count: 5 },
        { type: 'Assessment', count: 4 },
    ];

    const moodImprovementData = [
        { week: 'Week 1', avgMood: 2.8 },
        { week: 'Week 2', avgMood: 3.2 },
        { week: 'Week 3', avgMood: 3.5 },
        { week: 'Week 4', avgMood: 3.7 },
    ];

    const riskDistributionData = [
        { name: 'Low Risk', value: practiceMetrics.riskDistribution.low, color: '#10b981' },
        { name: 'Medium Risk', value: practiceMetrics.riskDistribution.medium, color: '#f59e0b' },
        { name: 'High Risk', value: practiceMetrics.riskDistribution.high, color: '#ef4444' },
    ];

    return (
        <div className="analytics-dashboard-page">
            <div className="analytics-header">
                <div>
                    <Button variant="ghost" onClick={() => navigate('/therapist/dashboard')}>
                        ← Back to Dashboard
                    </Button>
                    <h1>Analytics Dashboard</h1>
                    <p>Practice-wide insights and metrics</p>
                </div>
                <Button variant="ghost" onClick={logout}>
                    Logout
                </Button>
            </div>

            <div className="analytics-content">
                {/* Key Metrics Cards */}
                <div className="metrics-grid">
                    <Card className="metric-card">
                        <div className="metric-icon">👥</div>
                        <div className="metric-content">
                            <h3>{practiceMetrics.totalPatients}</h3>
                            <p>Total Patients</p>
                        </div>
                    </Card>

                    <Card className="metric-card">
                        <div className="metric-icon active">✓</div>
                        <div className="metric-content">
                            <h3>{practiceMetrics.activePatients}</h3>
                            <p>Active Patients</p>
                        </div>
                    </Card>

                    <Card className="metric-card">
                        <div className="metric-icon engagement">📊</div>
                        <div className="metric-content">
                            <h3>{practiceMetrics.avgEngagement}%</h3>
                            <p>Avg Engagement</p>
                        </div>
                    </Card>

                    <Card className="metric-card">
                        <div className="metric-icon sessions">📋</div>
                        <div className="metric-content">
                            <h3>{practiceMetrics.sessionsThisMonth}</h3>
                            <p>Sessions This Month</p>
                        </div>
                    </Card>
                </div>

                {/* Charts */}
                <div className="charts-grid">
                    <Card className="chart-card">
                        <h3>Patient Engagement Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="engagement"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    dot={{ fill: '#0ea5e9', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card className="chart-card">
                        <h3>Risk Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={riskDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {riskDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card className="chart-card">
                        <h3>Session Types Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={sessionTypesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="type" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card className="chart-card">
                        <h3>Average Mood Improvement</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={moodImprovementData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="week" stroke="#6b7280" />
                                <YAxis domain={[0, 5]} stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="avgMood"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Export Section */}
                <Card className="export-section">
                    <h3>📊 Generate Report</h3>
                    <p>Export practice analytics for the selected time period</p>
                    <div className="export-controls">
                        <select className="export-select">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 3 months</option>
                            <option>Last 6 months</option>
                            <option>Last year</option>
                            <option>Custom range</option>
                        </select>
                        <div className="export-buttons">
                            <Button variant="secondary" onClick={() => alert('PDF export (demo)')}>
                                📄 Export PDF
                            </Button>
                            <Button variant="secondary" onClick={() => alert('Excel export (demo)')}>
                                📊 Export Excel
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
