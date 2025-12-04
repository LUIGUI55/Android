import React from 'react';
import { Phone, Heart, Globe } from 'lucide-react';

const HelpDirectory = () => {
    return (
        <div className="help-directory">
            <h3>Recursos de Ayuda</h3>
            <div className="help-list">
                <div className="help-item">
                    <Phone size={20} />
                    <div className="help-info">
                        <h4>Línea de la Vida (México)</h4>
                        <a href="tel:8009112000">800 911 2000</a>
                        <p>Atención 24/7 para problemas de salud mental y adicciones.</p>
                    </div>
                </div>

                <div className="help-item">
                    <Globe size={20} />
                    <div className="help-info">
                        <h4>Alcohólicos Anónimos</h4>
                        <a href="https://www.aamexico.org.mx" target="_blank" rel="noopener noreferrer">www.aamexico.org.mx</a>
                        <p>Encuentra un grupo cerca de ti.</p>
                    </div>
                </div>

                <div className="help-item">
                    <Heart size={20} />
                    <div className="help-info">
                        <h4>Tips de Autocuidado</h4>
                        <ul>
                            <li>Practica la respiración profunda.</li>
                            <li>Llama a un amigo o familiar de confianza.</li>
                            <li>Sal a caminar y conecta con la naturaleza.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpDirectory;
