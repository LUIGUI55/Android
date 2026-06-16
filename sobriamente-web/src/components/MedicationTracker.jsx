import React, { useState, useEffect } from 'react';
import { Pill, Plus, CalendarCheck2, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const MedicationTracker = ({ user }) => {
    const [meds, setMeds] = useState(() => {
        const stored = localStorage.getItem('trackedMeds');
        return stored ? JSON.parse(stored) : [
            { id: 1, name: 'Vitamina B1', time: 'Mañana', taken: false }
        ];
    });
    const [newMed, setNewMed] = useState('');

    useEffect(() => {
        const loadMeds = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().meds !== undefined) {
                    setMeds(docSnap.data().meds);
                    localStorage.setItem('trackedMeds', JSON.stringify(docSnap.data().meds));
                }
            }
        };
        loadMeds();
    }, [user]);

    const saveMeds = async (updatedMeds) => {
        setMeds(updatedMeds);
        localStorage.setItem('trackedMeds', JSON.stringify(updatedMeds));
        if (user) {
            try {
                await setDoc(doc(db, "users", user.uid), { meds: updatedMeds }, { merge: true });
            } catch (e) {
                console.error("Error saving meds to Firestore", e);
            }
        }
    };

    const toggleMed = (id) => {
        const updated = meds.map(med => med.id === id ? { ...med, taken: !med.taken } : med);
        saveMeds(updated);
    };

    const addMed = () => {
        if (!newMed.trim()) return;
        const updated = [...meds, { id: Date.now(), name: newMed, time: 'General', taken: false }];
        saveMeds(updated);
        setNewMed('');
    };

    const deleteMed = (id) => {
        const updated = meds.filter(med => med.id !== id);
        saveMeds(updated);
    };

    return (
        <div className="medication-section">
            <div className="section-header">
                <Pill size={24} className="section-icon" style={{ color: '#f87171' }} />
                <h3>Médico y Terapia</h3>
            </div>
            
            <div className="meds-list">
                {meds.map(med => (
                    <div 
                        key={med.id} 
                        className={`med-item ${med.taken ? 'taken' : ''}`}
                        onClick={() => toggleMed(med.id)}
                    >
                        <div className="med-info">
                            <span className="med-name">{med.name}</span>
                            <span className="med-time">{med.time}</span>
                        </div>
                        <div className="med-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button 
                                className="delete-med-btn" 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    deleteMed(med.id); 
                                }}
                                title="Eliminar"
                                style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                            >
                                <Trash2 size={18} />
                            </button>
                            <button className="check-med-btn">
                                {med.taken ? <CalendarCheck2 size={20} color="#34d399" /> : <div className="empty-circle-sm"></div>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="add-med">
                <input 
                    type="text" 
                    placeholder="Nuevo medicamento / terapia..." 
                    value={newMed}
                    onChange={(e) => setNewMed(e.target.value)}
                    className="add-input"
                />
                <button onClick={addMed} className="add-btn">
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
};

export default MedicationTracker;
