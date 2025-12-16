import React, { useState } from 'react';
import { Settings as SettingsIcon, LogOut, Calendar, Save } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Settings = ({ user, startDate, onUpdateDate }) => {
    const [dateInput, setDateInput] = useState('');

    const handleSave = async () => {
        if (!dateInput) return;
        try {
            const dateObj = new Date(dateInput);
            await updateDoc(doc(db, "users", user.uid), {
                startDate: dateObj.toISOString()
            });
            onUpdateDate(dateObj);
            alert("Fecha actualizada correctamente.");
        } catch (e) {
            console.error(e);
            alert("Error al guardar la fecha.");
        }
    };

    const handleLogout = async () => {
        if (confirm("¿Cerrar sesión?")) {
            await signOut(auth);
            window.location.href = "/";
        }
    };

    return (
        <div className="settings-view fade-in">
            <div className="settings-header">
                <SettingsIcon size={32} className="settings-icon" />
                <h2>Ajustes</h2>
            </div>

            <div className="settings-section">
                <h3><Calendar size={20} /> Editar Fecha de Inicio</h3>
                <p>Si la fecha mostrada no es correcta, puedes ajustarla aquí.</p>

                <div className="date-input-group">
                    <input
                        type="datetime-local"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        className="date-input"
                    />
                    <button onClick={handleSave} className="save-btn">
                        <Save size={18} />
                        Guardar
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <h3>Cuenta</h3>
                <p>Usuario: {user.isAnonymous ? 'Anónimo' : user.email}</p>
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18} />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Settings;
