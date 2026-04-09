import React, { useState } from 'react';
import { Users, MessageSquare, Trophy, Heart } from 'lucide-react';

const MOCK_TESTIMONIALS = [
    { id: 1, author: 'GuerreroAnónimo', days: 120, text: 'No pensé que llegaría tan lejos. El mood tracker me ayudó a identificar mis patrones de estrés.', likes: 24 },
    { id: 2, author: 'LoboSolitario', days: 45, text: 'Ayer tuve un antojo terrible, pero usé el botón de pánico y llamé a mi padrino. Hoy estoy agradecido.', likes: 112 },
    { id: 3, author: 'Renacer23', days: 5, text: 'Primeros días. Duele mucho pero leo sus mensajes y me da fuerza.', likes: 89 },
];

const MOCK_LEADERBOARD = [
    { rank: 1, name: 'SoberKing', score: 365 },
    { rank: 2, name: 'GuerreroAnónimo', score: 120 },
    { rank: 3, name: 'NuevaVida', score: 98 },
    { rank: 4, name: 'Tú', score: 12 }, /* Example mock for the user */
    { rank: 5, name: 'Renacer23', score: 5 },
];

const Community = () => {
    const [activeTab, setActiveTab] = useState('testimonials');

    return (
        <div className="community-view fade-in">
            <div className="view-header">
                <Users size={32} color="#f472b6" />
                <h2>Comunidad de Apoyo</h2>
                <p>No estás solo. Somos miles peleando la misma batalla.</p>
            </div>

            <div className="tabs-container">
                <button 
                    className={`tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
                    onClick={() => setActiveTab('testimonials')}
                >
                    <MessageSquare size={18} /> Testimonios
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('leaderboard')}
                >
                    <Trophy size={18} /> Competencia Amigable
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'testimonials' && (
                    <div className="testimonials-list">
                        {MOCK_TESTIMONIALS.map(t => (
                            <div key={t.id} className="testimonial-card">
                                <div className="test-header">
                                    <span className="author">{t.author}</span>
                                    <span className="badge-days">{t.days} Días</span>
                                </div>
                                <p className="test-text">"{t.text}"</p>
                                <div className="test-footer">
                                    <button className="like-btn"><Heart size={14} /> {t.likes}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div className="leaderboard-list">
                        <div className="leaderboard-info">Clasificación anónima global por días acumulados.</div>
                        {MOCK_LEADERBOARD.map(p => (
                            <div key={p.rank} className={`leaderboard-row ${p.name === 'Tú' ? 'highlight' : ''}`}>
                                <div className="rank">#{p.rank}</div>
                                <div className="player-name">{p.name}</div>
                                <div className="player-score">{p.score} Días</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
