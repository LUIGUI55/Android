import React from 'react';
import { BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { differenceInDays, subDays, format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatisticsChart = ({ startDate, user }) => {
    // Generate some mock historical data based on startDate
    // Basically an accumulating savings chart since the start date
    const daysSober = startDate ? Math.max(0, differenceInDays(new Date(), new Date(startDate))) : 0;
    
    // Create an aesthetic chart showing progression over the last 7 days
    const labels = [];
    const dataPoints = [];
    
    // For demo purposes, we show the last week of progress
    for (let i = 6; i >= 0; i--) {
        const d = subDays(new Date(), i);
        labels.push(format(d, 'dd/MM'));
        // Mock data logic: simulating increasing savings/points
        const daysAtThatTime = Math.max(0, daysSober - i);
        dataPoints.push(daysAtThatTime);
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Días Acumulados',
                data: dataPoints,
                borderColor: '#2dd4bf', // accent-color
                backgroundColor: 'rgba(45, 212, 191, 0.2)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#2dd4bf',
                pointBorderWidth: 2,
                pointRadius: 4,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#f1f5f9',
                bodyColor: '#38bdf8',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    return (
        <div className="statistics-section">
            <div className="section-header">
                <BarChart3 size={24} className="section-icon" style={{ color: '#38bdf8' }} />
                <h3>Estadísticas Profesionales</h3>
            </div>
            
            <div className="chart-container" style={{ position: 'relative', height: '200px', width: '100%', marginTop: '1rem' }}>
                <Line data={data} options={options} />
            </div>
            
            <div className="stats-summary">
                <div className="stat-card">
                    <span className="stat-value">100%</span>
                    <span className="stat-label">Éxito en el mes</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{daysSober}</span>
                    <span className="stat-label">Racha actual</span>
                </div>
            </div>
        </div>
    );
};

export default StatisticsChart;
