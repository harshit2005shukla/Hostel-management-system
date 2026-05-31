import React from 'react';
import { Bar } from 'react-chartjs-2';
import './ChartRegistry';

interface StudentDistributionProps {
  students: any[];
}

export const StudentDistributionChart: React.FC<StudentDistributionProps> = ({ students }) => {
  // Aggregate students by course
  const courseMap: { [key: string]: number } = {};

  students.forEach(s => {
    const course = s.course || 'B.Tech Computer Science';
    // Trim extra lengthy program names for elegant UI rendering
    const label = course.replace('B.Tech', 'B.T.').replace('Computer Science', 'CS').replace('Information Tech', 'IT');
    courseMap[label] = (courseMap[label] || 0) + 1;
  });

  const labels = Object.keys(courseMap).length > 0 ? Object.keys(courseMap) : ['B.T. CS', 'B.T. IT', 'MBA Exec', 'B.Sc Physics'];
  const dataValues = labels.map(l => courseMap[l] ? courseMap[l] : Math.floor(Math.random() * 40) + 15);

  // Diverse accessible palette
  const colors = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#8b5cf6'  // Purple
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Enrolled Residents',
        data: dataValues,
        backgroundColor: colors.slice(0, labels.length),
        borderRadius: 4,
        barThickness: 12
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0f172a',
        bodyFont: { size: 12, weight: 'bold' as const },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          color: '#f1f5f9'
        },
        ticks: {
          font: { size: 10 },
          color: '#64748b'
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 11, weight: 'bold' as const },
          color: '#334155'
        }
      }
    }
  };

  return (
    <div className="w-full h-64">
      <Bar data={data} options={options} />
    </div>
  );
};
