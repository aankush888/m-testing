import React from 'react';
import './AIInsightsPanel.css';

export interface AIInsight {
    id: string;
    type: 'info' | 'warning' | 'critical';
    category: 'risk' | 'theme' | 'intervention' | 'followup';
    title: string;
    description: string;
    confidence: number; // 0-100
    reasoning?: string;
    approved?: boolean;
}

interface AIInsightsPanelProps {
    insights: AIInsight[];
    onApprove?: (insightId: string) => void;
    onDismiss?: (insightId: string) => void;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
    insights,
    onApprove,
    onDismiss,
}) => {
    const [expandedInsights, setExpandedInsights] = React.useState<Set<string>>(new Set());

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expandedInsights);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedInsights(newExpanded);
    };

    const getIcon = (type: AIInsight['type']) => {
        switch (type) {
            case 'info': return 'ℹ️';
            case 'warning': return '⚠️';
            case 'critical': return '🚨';
        }
    };

    const getCategoryLabel = (category: AIInsight['category']) => {
        switch (category) {
            case 'risk': return 'Risk Detection';
            case 'theme': return 'Theme Identified';
            case 'intervention': return 'Suggested Intervention';
            case 'followup': return 'Follow-up Action';
        }
    };

    return (
        <div className="ai-insights-panel">
            <div className="panel-header">
                <h3>🤖 AI Insights</h3>
                <span className="insights-count">{insights.length}</span>
            </div>

            <div className="panel-description">
                <p className="text-sm">
                    AI-generated suggestions to support your clinical judgment.
                    Review and approve as appropriate.
                </p>
            </div>

            <div className="insights-list">
                {insights.length === 0 ? (
                    <div className="no-insights">
                        <p>No AI insights generated yet.</p>
                    </div>
                ) : (
                    insights.map((insight) => (
                        <div
                            key={insight.id}
                            className={`insight-card insight-${insight.type} ${insight.approved ? 'approved' : ''
                                }`}
                        >
                            <div className="insight-header" onClick={() => toggleExpanded(insight.id)}>
                                <div className="insight-title-row">
                                    <span className="insight-icon">{getIcon(insight.type)}</span>
                                    <div className="insight-title-content">
                                        <span className="insight-category">{getCategoryLabel(insight.category)}</span>
                                        <h4>{insight.title}</h4>
                                    </div>
                                    <button className="expand-btn">
                                        {expandedInsights.has(insight.id) ? '▼' : '▶'}
                                    </button>
                                </div>
                            </div>

                            <div className="insight-body">
                                <p className="insight-description">{insight.description}</p>

                                <div className="confidence-bar">
                                    <div className="confidence-label">
                                        <span className="text-sm">AI Confidence</span>
                                        <span className="confidence-value">{insight.confidence}%</span>
                                    </div>
                                    <div className="confidence-progress">
                                        <div
                                            className="confidence-fill"
                                            style={{ width: `${insight.confidence}%` }}
                                        />
                                    </div>
                                </div>

                                {expandedInsights.has(insight.id) && insight.reasoning && (
                                    <div className="insight-reasoning">
                                        <strong className="text-sm">AI Reasoning:</strong>
                                        <p className="text-sm">{insight.reasoning}</p>
                                    </div>
                                )}

                                {!insight.approved && (
                                    <div className="insight-actions">
                                        <button
                                            className="approve-btn"
                                            onClick={() => onApprove?.(insight.id)}
                                        >
                                            ✓ Accept
                                        </button>
                                        <button
                                            className="dismiss-btn"
                                            onClick={() => onDismiss?.(insight.id)}
                                        >
                                            ✕ Dismiss
                                        </button>
                                    </div>
                                )}

                                {insight.approved && (
                                    <div className="approved-badge">
                                        ✓ Approved by Clinician
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="panel-footer">
                <p className="text-xs">
                    💡 These are AI-generated suggestions. Always use your clinical judgment.
                </p>
            </div>
        </div>
    );
};
