import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const articles = [
    {
        id: 1,
        title: "Manejo de la Ansiedad",
        content: "La ansiedad es común en la recuperación. Practica la técnica 4-7-8: Inhala por 4 segundos, mantén por 7, y exhala por 8. Esto ayuda a calmar el sistema nervioso."
    },
    {
        id: 2,
        title: "Identificando Detonantes",
        content: "Los detonantes pueden ser personas, lugares o emociones. Lleva un diario para identificar qué situaciones te provocan deseos de consumir y planea cómo evitarlas o enfrentarlas."
    },
    {
        id: 3,
        title: "La Importancia del Sueño",
        content: "El sueño reparador es vital para la salud mental. Intenta mantener un horario regular y evita pantallas una hora antes de dormir."
    },
    {
        id: 4,
        title: "Nutrición y Recuperación",
        content: "Una dieta balanceada ayuda a estabilizar el estado de ánimo. Prioriza alimentos ricos en proteínas, grasas saludables y vegetales."
    }
];

const EducationSection = () => {
    const [expandedId, setExpandedId] = useState(null);

    const toggleArticle = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="education-section">
            <div className="section-header">
                <BookOpen size={24} className="section-icon" />
                <h3>Educación y Consejos</h3>
            </div>

            <div className="articles-list">
                {articles.map((article) => (
                    <div key={article.id} className="article-card">
                        <div
                            className="article-header"
                            onClick={() => toggleArticle(article.id)}
                        >
                            <h4>{article.title}</h4>
                            {expandedId === article.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {expandedId === article.id && (
                            <div className="article-content">
                                <p>{article.content}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationSection;
