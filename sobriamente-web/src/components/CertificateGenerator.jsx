import React from 'react';
import { Award, Download } from 'lucide-react';
import { format } from 'date-fns';

const CertificateGenerator = ({ daysSober, startDate }) => {
    const handlePrint = () => {
        window.print();
    };

    if (daysSober < 1) return null;

    return (
        <div className="certificate-wrapper" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button 
                onClick={handlePrint}
                className="auth-btn"
                style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#0f172a', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '50px', display: 'inline-flex', gap: '0.5rem', alignItems: 'center', border: 'none', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
            >
                <Download size={18} />
                <span>Descargar Certificado ({daysSober} Días)</span>
            </button>

            {/* Hidden printable area */}
            <div className="printable-certificate" style={{ display: 'none' }}>
                <style>
                    {`
                    @media print {
                        body * { visibility: hidden; }
                        .printable-certificate, .printable-certificate * { visibility: visible; }
                        .printable-certificate {
                            display: flex !important;
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100vh;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            font-family: Arial, sans-serif;
                            text-align: center;
                            color: #0f172a;
                        }
                    }
                    `}
                </style>
                <div style={{ border: '10px solid #38bdf8', padding: '4rem', borderRadius: '20px', maxWidth: '800px', margin: '0 auto', background: '#f8fafc' }}>
                    <h1 style={{ fontSize: '3rem', color: '#0f172a', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>Certificado de Logro</h1>
                    <Award size={80} color="#38bdf8" style={{ margin: '2rem auto' }} />
                    <p style={{ fontSize: '1.5rem', margin: '2rem 0' }}>Concedido por la dedicación y esfuerzo al alcanzar:</p>
                    <h2 style={{ fontSize: '4rem', color: '#10b981', margin: '0' }}>{daysSober} Días</h2>
                    <p style={{ fontSize: '1.5rem', marginTop: '0' }}>de completa sobriedad</p>
                    <p style={{ marginTop: '3rem', fontSize: '1.2rem', color: '#64748b' }}>Iniciado el: {startDate ? format(new Date(startDate), 'dd/MM/yyyy') : 'N/A'}</p>
                    <p style={{ fontSize: '1rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '2rem' }}>Generado por Sobriamente Web</p>
                </div>
            </div>
        </div>
    );
};

export default CertificateGenerator;
