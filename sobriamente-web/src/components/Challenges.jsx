import React, { useState, useEffect } from 'react';
import { Target, CheckCircle } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const DEFAULT_CHALLENGES = [
    { id: 'c1', title: 'Hacer 10 minutos de ejercicio' },
    { id: 'c2', title: 'Llamar a un amigo de confianza' },
    { id: 'c3', title: 'Escribir 3 cosas por las que estoy agradecido' }
];

const Challenges = ({ user }) => {
    const [completed, setCompleted] = useState(() => {
        const today = new Date().toISOString().split('T')[0];
        const stored = localStorage.getItem(`challenges_${today}`);
        return stored ? JSON.parse(stored) : {};
    });

    const getTodayKey = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const loadChallenges = async () => {
            const today = getTodayKey();
            if (user) {
                const docRef = doc(db, "users", user.uid, "challenges", today);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().completed !== undefined) {
                    setCompleted(docSnap.data().completed || {});
                    localStorage.setItem(`challenges_${today}`, JSON.stringify(docSnap.data().completed || {}));
                }
            }
        };
        loadChallenges();
    }, [user]);

    const toggleChallenge = async (id) => {
        const newCompleted = { ...completed, [id]: !completed[id] };
        setCompleted(newCompleted);

        const today = getTodayKey();
        localStorage.setItem(`challenges_${today}`, JSON.stringify(newCompleted));

        if (user) {
            try {
                await setDoc(doc(db, "users", user.uid, "challenges", today), {
                    completed: newCompleted,
                    timestamp: new Date().toISOString()
                }, { merge: true });
            } catch (e) {
                console.error("Error saving challenges", e);
            }
        }
    };

    return (
        <div className="challenges-section">
            <div className="section-header">
                <Target size={24} className="section-icon" style={{ color: '#fb923c' }} />
                <h3>Desafíos Diarios</h3>
            </div>
            
            <div className="challenges-list">
                {DEFAULT_CHALLENGES.map((challenge) => {
                    const isDone = !!completed[challenge.id];
                    return (
                        <div 
                            key={challenge.id} 
                            className={`challenge-item ${isDone ? 'done' : ''}`}
                            onClick={() => toggleChallenge(challenge.id)}
                        >
                            <div className="challenge-checkbox">
                                {isDone ? <CheckCircle size={20} className="check-icon" /> : <div className="empty-circle"></div>}
                            </div>
                            <span className="challenge-title">{challenge.title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Challenges;
