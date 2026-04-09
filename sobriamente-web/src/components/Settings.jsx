import React, { useState } from 'react';
import { Settings as SettingsIcon, LogOut, Calendar, Save, Download, Upload } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Swal from 'sweetalert2';

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
            Swal.fire({
                title: 'Hecho',
                text: 'Fecha actualizada correctamente.',
                icon: 'success',
                background: '#1e293b',
                color: '#f1f5f9'
            });
        } catch (e) {
            console.error(e);
            Swal.fire({
                title: 'Error',
                text: 'Error al guardar la fecha.',
                icon: 'error',
                background: '#1e293b',
                color: '#f1f5f9'
            });
        }
    };

    const handleLogout = async () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#f43f5e',
            background: '#1e293b',
            color: '#f1f5f9'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await signOut(auth);
                window.location.href = "/";
            }
        });
    };

    const handleExport = () => {
        const data = JSON.stringify(localStorage);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sobriamente_backup_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                Object.keys(data).forEach(key => {
                    localStorage.setItem(key, data[key]);
                });
                Swal.fire({
                    title: 'Restaurado',
                    text: 'Datos restaurados correctamente.',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#f1f5f9'
                }).then(() => {
                    window.location.reload();
                });
            } catch (err) {
                Swal.fire({
                    title: 'Error',
                    text: 'Archivo JSON inválido',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#f1f5f9'
                });
            }
        };
        reader.readAsText(file);
    };

    const handleNotificationRequest = () => {
        if (!("Notification" in window)) {
            Swal.fire({
                title: 'No soportado',
                text: 'Tu navegador no soporta notificaciones.',
                icon: 'info',
                background: '#1e293b',
                color: '#f1f5f9'
            });
            return;
        }

        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                Swal.fire({
                    title: '¡Permiso Concedido!',
                    text: 'Recibirás recordatorios y mensajes motivadores poco a poco.',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#f1f5f9'
                });
                new Notification("Sobriamente", {
                    body: "¡Gracias por activar las notificaciones! Estamos contigo.",
                    icon: "/logo.svg"
                });
            }
        });
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
                <h3>Notificaciones</h3>
                <p>Activa recordatorios diarios y alertas de hitos alcanzados.</p>
                <button onClick={handleNotificationRequest} className="auth-btn" style={{ background: '#f59e0b', color: 'white', display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px', border: 'none', fontWeight: 'bold', marginTop: '1rem' }}>
                    Activar Notificaciones
                </button>
            </div>

            <div className="settings-section">
                <h3>Respaldo y Privacidad</h3>
                <p>Guarda una copia de tus progresos (solo incluye datos guardados localmente).</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button onClick={handleExport} className="auth-btn" style={{ background: '#3b82f6', color: 'white', display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>
                        <Download size={18} /> Exportar
                    </button>
                    <div>
                        <input type="file" accept=".json" id="import-json" style={{ display: 'none' }} onChange={handleImport} />
                        <label htmlFor="import-json" className="auth-btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid #475569', fontWeight: 'bold' }}>
                            <Upload size={18} /> Importar
                        </label>
                    </div>
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
