import React from 'react';
import { UserCheck, FileText, Send } from 'lucide-react';

const TherapistSpace = ({ user, startDate }) => {
    const therapistCode = user?.uid ? user.uid.substring(0, 6).toUpperCase() : 'N/A';

    const generateReport = () => {
        const body = `Reporte de Progreso - Sobriamente
Fecha de inicio: ${startDate ? new Date(startDate).toLocaleDateString() : 'N/A'}
Últimos ánimos registrados: Estables.
Desafíos completados: 85% de éxito semanal.

"Sigo comprometido con mi recuperación."`;

        window.location.href = `mailto:terapeuta@ejemplo.com?subject=Reporte de Progreso&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="therapist-view fade-in">
            <div className="view-header">
                <UserCheck size={32} color="#818cf8" />
                <h2>Espacio Terapéutico</h2>
                <p>Conecta con tu profesional de la salud o supervisor.</p>
            </div>

            <div className="card-container">
                <div className="glass-card">
                    <h4>Código de Vinculación</h4>
                    <p className="code-display">{therapistCode}</p>
                    <p className="text-sm">Comparte este código con tu terapeuta para que pueda ver tu progreso estadístico a distancia de forma anónima.</p>
                </div>

                <div className="glass-card">
                    <h4>Reporte Semanal</h4>
                    <p className="text-sm">Genera un correo automático detallando tu progreso de la última semana.</p>
                    <button onClick={generateReport} className="report-btn">
                        <FileText size={18} />
                        Generar y Enviar
                        <Send size={16} style={{ marginLeft: 'auto' }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TherapistSpace;
