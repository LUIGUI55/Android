import React, { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Heart, Activity } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const MOODS = [
    { id: 'happy', icon: Smile, label: 'Feliz', color: '#34d399' },
    { id: 'motivated', icon: Heart, label: 'Motivado', color: '#f472b6' },
    { id: 'neutral', icon: Meh, label: 'Normal', color: '#94a3b8' },
    { id: 'anxious', icon: Activity, label: 'Ansioso', color: '#fbbf24' },
    { id: 'sad', icon: Frown, label: 'Triste', color: '#818cf8' }
];

const MoodTracker = ({ user }) => {
    const [todayMood, setTodayMood] = useState(null);

    const getTodayKey = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const loadMood = async () => {
            const today = getTodayKey();
            if (user) {
                const docRef = doc(db, "users", user.uid, "moods", today);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTodayMood(docSnap.data().moodId);
                    return;
                }
            }
            // Fallback local
            const stored = localStorage.getItem(`mood_${today}`);
            if (stored) {
                setTodayMood(stored);
            }
        };
        loadMood();
    }, [user]);

    const handleSelectMood = async (moodId) => {
        setTodayMood(moodId);
        const today = getTodayKey();
        localStorage.setItem(`mood_${today}`, moodId);

        if (user) {
            try {
                await setDoc(doc(db, "users", user.uid, "moods", today), {
                    moodId,
                    timestamp: new Date().toISOString()
                }, { merge: true });
            } catch (e) {
                console.error("Error saving mood", e);
            }
        }
    };

    return (
        <div className="mood-tracker-section">
            <div className="section-header">
                <h3>¿Cómo te sientes hoy?</h3>
            </div>
            
            <div className="moods-grid">
                {MOODS.map((mood) => {
                    const Icon = mood.icon;
                    const isActive = todayMood === mood.id;
                    return (
                        <button 
                            key={mood.id} 
                            onClick={() => handleSelectMood(mood.id)}
                            className={`mood-btn ${isActive ? 'active' : ''}`}
                            style={{ '--mood-color': mood.color }}
                        >
                            <Icon size={28} />
                            <span>{mood.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MoodTracker;
