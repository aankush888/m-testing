import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import './FloatingCrisisButton.css';

export const FloatingCrisisButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showBreathing, setShowBreathing] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

    const startBreathingExercise = () => {
        setShowBreathing(true);
        setBreathingPhase('inhale');

        // Breathing cycle: 4s inhale -> 4s hold -> 4s exhale
        let phase = 0;
        const interval = setInterval(() => {
            phase++;
            if (phase % 3 === 1) setBreathingPhase('inhale');
            else if (phase % 3 === 2) setBreathingPhase('hold');
            else setBreathingPhase('exhale');
        }, 4000);

        // Auto-stop after 5 cycles (1 minute)
        setTimeout(() => {
            clearInterval(interval);
            setShowBreathing(false);
        }, 60000);
    };

    const getBreathingText = () => {
        switch (breathingPhase) {
            case 'inhale': return 'Breathe In...';
            case 'hold': return 'Hold...';
            case 'exhale': return 'Breathe Out...';
        }
    };

    return (
        <>
            <button
                className="floating-crisis-btn"
                onClick={() => setIsOpen(true)}
                title="Need Help Now"
            >
                <span className="crisis-icon">❤️</span>
                <span className="crisis-pulse"></span>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="We're Here for You"
                size="md"
            >
                {showBreathing ? (
                    <div className="breathing-exercise">
                        <div className={`breathing-circle breathing-${breathingPhase}`}>
                            <span className="breathing-text">{getBreathingText()}</span>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => setShowBreathing(false)}
                            className="mt-lg"
                        >
                            Stop Exercise
                        </Button>
                    </div>
                ) : (
                    <div className="crisis-options">
                        <p className="crisis-message">
                            You're not alone. Help is available right now.
                        </p>

                        <div className="crisis-actions">
                            <Button
                                variant="danger"
                                fullWidth
                                onClick={() => window.open('tel:988', '_self')}
                            >
                                📞 Call Crisis Hotline (988)
                            </Button>

                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => alert('In a real app, this would contact your therapist')}
                            >
                                💬 Message My Therapist
                            </Button>

                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => alert('In a real app, this would call your emergency contact')}
                            >
                                👤 Call Emergency Contact
                            </Button>

                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={startBreathingExercise}
                            >
                                🌬️ Grounding Exercise (Breathing)
                            </Button>
                        </div>

                        <div className="crisis-resources mt-lg">
                            <p className="text-sm">
                                <strong>National Crisis Resources:</strong>
                            </p>
                            <ul className="text-sm">
                                <li>Crisis Text Line: Text HOME to 741741</li>
                                <li>National Suicide Prevention Lifeline: 988</li>
                                <li>Emergency Services: 911</li>
                            </ul>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};
