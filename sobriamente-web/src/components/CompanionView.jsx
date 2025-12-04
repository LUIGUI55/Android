import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import SobrietyCounter from './SobrietyCounter';
import Achievements from './Achievements';
import { Heart, Home } from 'lucide-react';

const CompanionView = () => {
    const { userId } = useParams();
    const [startDate, setStartDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, "users", userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setStartDate(new Date(docSnap.data().startDate));
                } else {
                    setError("Usuario no encontrado o no ha iniciado su viaje aún.");
                }
            } catch (err) {
                console.error(err);
                setError("Error al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) return <div className="loading">Cargando progreso...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="companion-view fade-in">
            <div className="companion-header">
                <Heart size={32} className="heart-icon" />
                <h2>Acompañando a un Ser Querido</h2>
                <p>Estás viendo el progreso de alguien especial.</p>
            </div>

            <div className="dashboard">
                <SobrietyCounter startDate={startDate} onReset={() => { }} />
                <Achievements startDate={startDate} />
            </div>

            <Link to="/" className="back-home-btn">
                <Home size={20} />
                <span>Ir al Inicio</span>
            </Link>
        </div>
    );
};

export default CompanionView;
