import React, { useState } from 'react';
import { Pill, Plus, CalendarCheck2 } from 'lucide-react';

const MedicationTracker = () => {
    const [meds, setMeds] = useState([
        { id: 1, name: 'Vitamina B1', time: 'Mañana', taken: false }
    ]);
    const [newMed, setNewMed] = useState('');

    const toggleMed = (id) => {
        setMeds(meds.map(med => med.id === id ? { ...med, taken: !med.taken } : med));
    };

    const addMed = () => {
        if (!newMed.trim()) return;
        setMeds([...meds, { id: Date.now(), name: newMed, time: 'General', taken: false }]);
        setNewMed('');
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
                        <button className="check-med-btn">
                            {med.taken ? <CalendarCheck2 size={20} color="#34d399" /> : <div className="empty-circle-sm"></div>}
                        </button>
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
