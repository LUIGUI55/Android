import React, { useState, useEffect } from 'react';
import { DollarSign, Edit2, Check } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2';

const SavingsCalculator = ({ startDate, user }) => {
    const [dailyCost, setDailyCost] = useState(() => {
        const stored = localStorage.getItem('dailyCost');
        return stored ? Number(stored) : 0;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempCost, setTempCost] = useState('');

    useEffect(() => {
        const loadSavings = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().dailyCost !== undefined) {
                    setDailyCost(docSnap.data().dailyCost);
                    localStorage.setItem('dailyCost', docSnap.data().dailyCost.toString());
                }
            }
        };
        loadSavings();
    }, [user]);

    const handleSave = async () => {
        const cost = Number(tempCost);
        
        if (isNaN(cost) || cost < 0) {
            Swal.fire({
                title: 'Valor Inválido',
                text: 'Por favor, ingresa un número positivo para tu gasto diario.',
                icon: 'error',
                background: '#1e293b',
                color: '#f1f5f9'
            });
            return;
        }

        setDailyCost(cost);
        localStorage.setItem('dailyCost', cost.toString());

        if (user) {
            try {
                await setDoc(doc(db, "users", user.uid), { dailyCost: cost }, { merge: true });
            } catch (e) {
                console.error("Error saving daily cost", e);
            }
        }
        setIsEditing(false);
        
        Swal.fire({
            title: '¡Guardado!',
            text: 'Tu gasto diario ha sido actualizado.',
            icon: 'success',
            background: '#1e293b',
            color: '#f1f5f9',
            timer: 2000,
            showConfirmButton: false
        });
    };

    const daysSober = startDate ? Math.max(0, (new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 0;
    const totalSaved = daysSober * dailyCost;

    return (
        <div className="savings-section">
            <div className="section-header">
                <DollarSign size={24} className="section-icon" style={{ color: '#34d399' }} />
                <h3>Ahorro Económico</h3>
            </div>
            
            <div className="savings-content">
                <div className="total-saved">
                    <span className="currency">$</span>
                    <span className="amount">{totalSaved.toFixed(2)}</span>
                    <span className="label-saved">ahorrados hasta ahora</span>
                </div>

                <div className="daily-cost-config" style={{ background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '15px' }}>
                    {isEditing ? (
                        <div className="edit-cost" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ingresa cuánto gastabas al día:</p>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                <input 
                                    type="number" 
                                    min="0"
                                    step="0.01"
                                    autoFocus
                                    value={tempCost} 
                                    onChange={(e) => setTempCost(e.target.value)} 
                                    placeholder="0.00" 
                                    className="cost-input"
                                    style={{ width: '150px', fontSize: '1.2rem', padding: '0.5rem' }}
                                />
                                <button onClick={handleSave} className="save-cost-btn" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={20} />
                                    <span>Guardar</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="view-cost" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <span className="cost-label" style={{ fontSize: '1.1rem', fontWeight: '600' }}>Gasto diario: ${dailyCost}</span>
                                <button onClick={() => { setTempCost(dailyCost.toString()); setIsEditing(true); }} className="edit-cost-btn" title="Editar gasto diario">
                                    <Edit2 size={16} />
                                </button>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Haz clic en el lápiz para actualizar tu gasto estimado</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavingsCalculator;
