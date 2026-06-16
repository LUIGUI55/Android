import React, { useState, useEffect } from 'react';
import { BookOpen, Edit2, Check } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const WhyIStarted = ({ user }) => {
    const [reason, setReason] = useState(() => localStorage.getItem('whyReason') || '');
    const [isEditing, setIsEditing] = useState(false);
    const [tempReason, setTempReason] = useState('');

    useEffect(() => {
        const loadReason = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().reason !== undefined) {
                    setReason(docSnap.data().reason);
                    localStorage.setItem('whyReason', docSnap.data().reason);
                }
            }
        };
        loadReason();
    }, [user]);

    const handleSave = async () => {
        setReason(tempReason);
        localStorage.setItem('whyReason', tempReason);

        if (user) {
            try {
                await setDoc(doc(db, "users", user.uid), { reason: tempReason }, { merge: true });
            } catch (e) {
                console.error("Error saving reason", e);
            }
        }
        setIsEditing(false);
    };

    return (
        <div className="why-started-section">
            <div className="section-header">
                <BookOpen size={24} className="section-icon" style={{ color: '#a78bfa' }} />
                <h3>¿Por qué empecé?</h3>
                {!isEditing && (
                    <button onClick={() => { setTempReason(reason); setIsEditing(true); }} className="edit-btn">
                        <Edit2 size={16} />
                    </button>
                )}
            </div>
            
            <div className="why-content">
                {isEditing ? (
                    <div className="edit-reason">
                        <textarea 
                            value={tempReason}
                            onChange={(e) => setTempReason(e.target.value)}
                            placeholder="Escribe tu razón principal para empezar este cambio..."
                            rows="4"
                            className="reason-input"
                        />
                        <button onClick={handleSave} className="save-btn-small">
                            <Check size={16} /> Guardar
                        </button>
                    </div>
                ) : (
                    <div className="view-reason">
                        {reason ? (
                            <p className="reason-text">"{reason}"</p>
                        ) : (
                            <p className="placeholder-text">Toca el botón de editar para escribir qué te motivó a empezar.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhyIStarted;
