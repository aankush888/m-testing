import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import './LoginPage.css';

type UserRole = 'client' | 'therapist' | 'caregiver';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [role, setRole] = useState<UserRole>('client');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSendOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        // Simulate OTP sending
        setTimeout(() => {
            setLoading(false);
            setStep('otp');
        }, 1000);
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) return;

        setLoading(true);
        // Simulate OTP verification
        setTimeout(() => {
            login(email, role);
            setLoading(false);

            // Check if first-time user
            const existingUsers = JSON.parse(localStorage.getItem('manosanchay_users') || '{}');
            if (!existingUsers[email]) {
                navigate('/onboarding');
            } else {
                navigate(`/${role}/dashboard`);
            }
        }, 1000);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="gradient-text">ManoSanchay</h1>
                    <p className="login-tagline">Your Mental Health Journey, Supported</p>
                </div>

                <Card className="login-card">
                    {step === 'email' ? (
                        <form onSubmit={handleSendOTP}>
                            <h2>Welcome Back</h2>
                            <p className="login-subtitle">Enter your email or phone to continue</p>

                            <div className="form-group">
                                <label htmlFor="email">Email or Phone</label>
                                <input
                                    id="email"
                                    type="text"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">I am a...</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                >
                                    <option value="client">Client / Patient</option>
                                    <option value="therapist">Therapist</option>
                                    <option value="caregiver">Caregiver</option>
                                </select>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                loading={loading}
                                size="lg"
                            >
                                Send OTP
                            </Button>

                            <div className="login-info">
                                <p className="text-sm">
                                    💙 Your privacy and safety are our top priorities
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP}>
                            <h2>Verify OTP</h2>
                            <p className="login-subtitle">
                                We sent a code to <strong>{email}</strong>
                            </p>

                            <div className="form-group">
                                <label htmlFor="otp">Enter OTP</label>
                                <input
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                loading={loading}
                                size="lg"
                            >
                                Verify & Continue
                            </Button>

                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={() => setStep('email')}
                                className="mt-md"
                            >
                                ← Back
                            </Button>

                            <div className="login-info">
                                <p className="text-sm">
                                    Didn't receive code?{' '}
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleSendOTP(e); }}>
                                        Resend OTP
                                    </a>
                                </p>
                            </div>
                        </form>
                    )}
                </Card>

                <div className="login-footer">
                    <p className="text-sm">
                        By continuing, you agree to our Privacy Policy and Terms of Service
                    </p>
                </div>
            </div>
        </div>
    );
};
