import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import './OnboardingPage.css';

const STEPS = [
    {
        title: 'Welcome to Your Safe Space',
        subtitle: 'ManoSanchay is here to support your mental health journey',
        content: (
            <div className="onboarding-content">
                <div className="onboarding-icon">🌱</div>
                <h3>Our Purpose</h3>
                <ul className="onboarding-list">
                    <li>📝 Track your mood and emotions over time</li>
                    <li>💡 Gain insights into your mental health patterns</li>
                    <li>🤝 Stay connected with your therapist</li>
                    <li>❤️ Get support when you need it most</li>
                </ul>
                <p className="onboarding-note">
                    This is a judgment-free zone. You're in control of your journey.
                </p>
            </div>
        ),
    },
    {
        title: 'Your Privacy Matters',
        subtitle: 'You have complete control over your data',
        content: (
            <div className="onboarding-content">
                <div className="onboarding-icon">🔒</div>
                <h3>How We Protect You</h3>
                <ul className="onboarding-list">
                    <li>🔐 End-to-end encryption for all your data</li>
                    <li>👁️ You decide what to share with therapists</li>
                    <li>🚫 Your journals are private by default</li>
                    <li>✅ Caregivers only see what you allow</li>
                </ul>
                <p className="onboarding-note">
                    We never sell your data. Your trust is our foundation.
                </p>
            </div>
        ),
    },
    {
        title: "You're in Control",
        subtitle: 'Set your preferences and customize your experience',
        content: (
            <div className="onboarding-content">
                <div className="onboarding-icon">⚙️</div>
                <h3>What You Can Do</h3>
                <ul className="onboarding-list">
                    <li>🎨 Choose what insights you want to see</li>
                    <li>🔔 Control notification preferences</li>
                    <li>👥 Manage who can see your progress</li>
                    <li>⏸️ Pause or delete your data anytime</li>
                </ul>
                <p className="onboarding-note">
                    Change your mind? You can always update these settings later.
                </p>
            </div>
        ),
    },
];

export const OnboardingPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { user, completeOnboarding } = useAuth();
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeOnboarding();
            navigate(`/${user?.role}/dashboard`);
        }
    };

    const handleSkip = () => {
        completeOnboarding();
        navigate(`/${user?.role}/dashboard`);
    };

    const step = STEPS[currentStep];

    return (
        <div className="onboarding-page">
            <div className="onboarding-container">
                <div className="onboarding-progress">
                    {STEPS.map((_, index) => (
                        <div
                            key={index}
                            className={`progress-dot ${index <= currentStep ? 'active' : ''}`}
                        />
                    ))}
                </div>

                <Card className="onboarding-card">
                    <div className="onboarding-header">
                        <h1>{step.title}</h1>
                        <p className="onboarding-subtitle">{step.subtitle}</p>
                    </div>

                    {step.content}

                    <div className="onboarding-actions">
                        <Button
                            variant="primary"
                            fullWidth
                            size="lg"
                            onClick={handleNext}
                        >
                            {currentStep < STEPS.length - 1 ? 'Continue' : 'Get Started'}
                        </Button>

                        {currentStep < STEPS.length - 1 && (
                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={handleSkip}
                                className="mt-sm"
                            >
                                Skip for now
                            </Button>
                        )}
                    </div>

                    <div className="step-indicator">
                        Step {currentStep + 1} of {STEPS.length}
                    </div>
                </Card>
            </div>
        </div>
    );
};
