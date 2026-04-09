import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, CloudRain, Waves, TreePine } from 'lucide-react';

const SOUNDS = [
    { id: 'rain', name: 'Lluvia', icon: CloudRain, url: '/sounds/rain.mp3' },
    { id: 'sea', name: 'Mar', icon: Waves, url: '/sounds/sea.mp3' },
    { id: 'forest', name: 'Bosque', icon: TreePine, url: '/sounds/forest.mp3' }
];

const RelaxingExercises = () => {
    const [activeSound, setActiveSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState('Inhala'); // 'Inhala', 'Retén', 'Exhala'
    const [seconds, setSeconds] = useState(4);
    const [audio] = useState(new Audio());

    useEffect(() => {
        let interval = null;
        if (isBreathing) {
            interval = setInterval(() => {
                setSeconds(prev => {
                    if (prev > 1) return prev - 1;
                    
                    // Switch phases
                    if (breathingPhase === 'Inhala') {
                        setBreathingPhase('Retén');
                        return 7;
                    } else if (breathingPhase === 'Retén') {
                        setBreathingPhase('Exhala');
                        return 8;
                    } else {
                        setBreathingPhase('Inhala');
                        return 4;
                    }
                });
            }, 1000);
        } else {
            setBreathingPhase('Inhala');
            setSeconds(4);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isBreathing, breathingPhase]);

    useEffect(() => {
        if (activeSound && isPlaying) {
            const sound = SOUNDS.find(s => s.id === activeSound);
            if (audio.src !== sound.url) {
                audio.src = sound.url;
            }
            audio.loop = true;
            audio.play().catch(e => console.error("Error playing audio", e));
        } else {
            audio.pause();
        }

        return () => audio.pause();
    }, [activeSound, isPlaying, audio]);

    const toggleSound = (id) => {
        if (activeSound === id) {
            setIsPlaying(!isPlaying);
        } else {
            setActiveSound(id);
            setIsPlaying(true);
        }
    };

    return (
        <div className="relax-section">
            <div className="section-header">
                <Wind size={24} className="section-icon" style={{ color: '#60a5fa' }} />
                <h3>Relajación y Respiración</h3>
            </div>
            
            <div className="relax-content">
                <div className="breathing-container">
                    <h4>Técnica 4-7-8</h4>
                    <p className="breathing-desc">Inhala por 4s, retén por 7s, exhala por 8s.</p>
                    <div className="breathing-circle-wrapper">
                        <div className={`breathing-circle ${isBreathing ? breathingPhase.toLowerCase() : ''}`}>
                            {isBreathing && (
                                <div className="breathing-timer">
                                    <span className="phase-text">{breathingPhase}</span>
                                    <span className="seconds-text">{seconds}s</span>
                                </div>
                            )}
                        </div>
                        <button 
                            className="breathe-btn"
                            onClick={() => setIsBreathing(!isBreathing)}
                            style={{ 
                                marginTop: '1.5rem', 
                                background: isBreathing ? '#ef4444' : '#60a5fa',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            {isBreathing ? 'Detener Ejercicio' : 'Empezar Respiración'}
                        </button>
                    </div>
                </div>

                <div className="sounds-container">
                    <h4>Sonidos Ambientales</h4>
                    <div className="sounds-grid">
                        {SOUNDS.map(sound => {
                            const Icon = sound.icon;
                            const isActive = activeSound === sound.id;
                            return (
                                <button
                                    key={sound.id}
                                    className={`sound-btn ${isActive && isPlaying ? 'playing' : ''}`}
                                    onClick={() => toggleSound(sound.id)}
                                >
                                    <Icon size={20} />
                                    <span>{sound.name}</span>
                                    {isActive && isPlaying ? <Pause size={14} className="play-icon"/> : <Play size={14} className="play-icon"/>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RelaxingExercises;
