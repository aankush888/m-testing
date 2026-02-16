import React, { useState } from 'react';
import './VoiceRecorder.css';

interface VoiceRecorderProps {
    onTranscriptionComplete: (text: string) => void;
    placeholder?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
    onTranscriptionComplete,
    placeholder = 'Start recording to transcribe...',
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording && !isPaused) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording, isPaused]);

    const startRecording = () => {
        setIsRecording(true);
        setIsPaused(false);
        setRecordingTime(0);

        // Simulate progressive transcription
        const sampleText = "Patient reports feeling more stable this week. Sleep patterns have improved. Discussed coping strategies for managing work-related stress. Patient is engaging well with journaling exercises. ";

        let currentText = '';
        const words = sampleText.split(' ');
        let wordIndex = 0;

        const transcribeInterval = setInterval(() => {
            if (wordIndex < words.length) {
                currentText += words[wordIndex] + ' ';
                setTranscription(currentText);
                wordIndex++;
            } else {
                clearInterval(transcribeInterval);
            }
        }, 400);
    };

    const pauseRecording = () => {
        setIsPaused(!isPaused);
    };

    const stopRecording = () => {
        setIsRecording(false);
        setIsPaused(false);
        onTranscriptionComplete(transcription);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="voice-recorder">
            <div className="recorder-controls">
                {!isRecording ? (
                    <button className="record-btn" onClick={startRecording}>
                        <span className="record-icon">🎤</span>
                        Start Recording
                    </button>
                ) : (
                    <div className="recording-actions">
                        <button className="pause-btn" onClick={pauseRecording}>
                            {isPaused ? '▶️' : '⏸️'}
                        </button>
                        <div className="recording-indicator">
                            <span className={`recording-dot ${isPaused ? 'paused' : ''}`}></span>
                            <span className="recording-time">{formatTime(recordingTime)}</span>
                        </div>
                        <button className="stop-btn" onClick={stopRecording}>
                            ⏹️ Stop
                        </button>
                    </div>
                )}
            </div>

            {isRecording && (
                <div className="waveform">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={`waveform-bar ${isPaused ? 'paused' : ''}`}
                            style={{
                                animationDelay: `${i * 0.05}s`,
                                height: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>
            )}

            {transcription && (
                <div className="transcription-box">
                    <div className="transcription-header">
                        <span className="transcription-label">Live Transcription</span>
                        {isRecording && !isPaused && (
                            <span className="typing-indicator">●●●</span>
                        )}
                    </div>
                    <textarea
                        className="transcription-text"
                        value={transcription}
                        onChange={(e) => setTranscription(e.target.value)}
                        placeholder={placeholder}
                        rows={8}
                    />
                </div>
            )}
        </div>
    );
};
