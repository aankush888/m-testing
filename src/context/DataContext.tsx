import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MoodEntry {
    id: string;
    mood: number; // 1-5 scale
    intensity: number; // 1-10 scale
    context?: string;
    timestamp: Date;
    aiFeedback?: string;
    suggestedActivity?: string;
}

export interface JournalEntry {
    id: string;
    content: string;
    prompt?: string;
    timestamp: Date;
    aiResponse?: string;
    mood?: number;
}

interface DataContextType {
    moodEntries: MoodEntry[];
    journalEntries: JournalEntry[];
    addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
    addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
    getRecentMoodTrend: () => number[];
    hasRiskSignals: () => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

    useEffect(() => {
        // Load from localStorage
        const savedMoods = localStorage.getItem('manosanchay_moods');
        const savedJournals = localStorage.getItem('manosanchay_journals');

        if (savedMoods) {
            const parsed = JSON.parse(savedMoods);
            setMoodEntries(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
        }
        if (savedJournals) {
            const parsed = JSON.parse(savedJournals);
            setJournalEntries(parsed.map((j: any) => ({ ...j, timestamp: new Date(j.timestamp) })));
        }
    }, []);

    const addMoodEntry = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
        const newEntry: MoodEntry = {
            ...entry,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            aiFeedback: generateAIFeedback(entry.mood, entry.intensity),
            suggestedActivity: suggestActivity(entry.mood, entry.intensity),
        };

        const updated = [newEntry, ...moodEntries];
        setMoodEntries(updated);
        localStorage.setItem('manosanchay_moods', JSON.stringify(updated));
    };

    const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
        const newEntry: JournalEntry = {
            ...entry,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            aiResponse: generateAIJournalResponse(entry.content),
        };

        const updated = [newEntry, ...journalEntries];
        setJournalEntries(updated);
        localStorage.setItem('manosanchay_journals', JSON.stringify(updated));
    };

    const getRecentMoodTrend = () => {
        return moodEntries.slice(0, 7).reverse().map(e => e.mood);
    };

    const hasRiskSignals = () => {
        // Check for concerning patterns
        const recent = moodEntries.slice(0, 5);
        const lowMoods = recent.filter(e => e.mood <= 2).length;
        return lowMoods >= 3;
    };

    return (
        <DataContext.Provider
            value={{
                moodEntries,
                journalEntries,
                addMoodEntry,
                addJournalEntry,
                getRecentMoodTrend,
                hasRiskSignals,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

// AI Simulation Functions
function generateAIFeedback(mood: number, intensity: number): string {
    if (mood >= 4) {
        return "It's wonderful to see you're feeling good! Keep up whatever is working for you.";
    } else if (mood === 3) {
        return "Thank you for checking in. Remember, it's okay to have neutral days.";
    } else if (mood === 2) {
        return "I notice you're having a difficult time. Would you like to try a grounding exercise?";
    } else {
        return "Thank you for sharing how you feel. You're not alone in this. Consider reaching out to your support network.";
    }
}

function suggestActivity(mood: number, intensity: number): string {
    if (mood >= 4) {
        return "🎨 Try a creative activity to channel this positive energy!";
    } else if (mood === 3) {
        return "🚶 A short walk might help refresh your mind.";
    } else if (mood === 2) {
        return "🧘 Guided meditation or deep breathing could help.";
    } else {
        return "💬 Journaling your thoughts or talking to someone might provide relief.";
    }
}

function generateAIJournalResponse(content: string): string {
    const responses = [
        "Thank you for sharing this. Your feelings are valid and important.",
        "I hear you. It takes courage to express what you're going through.",
        "Your self-awareness is a strength. Keep being kind to yourself.",
        "This is a safe space for your thoughts. Thank you for trusting the process.",
        "I appreciate you taking the time to reflect and write. That's meaningful self-care.",
    ];

    // Simple sentiment analysis simulation
    const lowWords = ['sad', 'anxious', 'worried', 'stressed', 'difficult', 'hard', 'struggle'];
    const hasLowSentiment = lowWords.some(word => content.toLowerCase().includes(word));

    if (hasLowSentiment) {
        return "I notice you're working through some challenging feelings. Remember, reaching out for support is always an option. You don't have to face this alone.";
    }

    return responses[Math.floor(Math.random() * responses.length)];
}
