import React from 'react';
import { Bar } from 'react-chartjs-2';
import './ChartRegistry';

interface RoomOccupancyProps {
  rooms: any[];
}

export const RoomOccupancyChart: React.FC<RoomOccupancyProps> = ({ rooms }) => {
  // Aggregate capacity and occupancy per hostel block
  const blockMap: { [key: string]: { capacity: number; occupancy: number } } = {};

  rooms.forEach(r => {
    const block = r.hostelBlock || 'Block A';
    // Shorten block label for clean display
    const label = block.split('-')[0].trim();
    
    if (!blockMap[label]) {
      blockMap[label] = { capacity: 0, occupancy: 0 };
    }
    blockMap[label].capacity += r.capacity || 2;
    blockMap[label].occupancy += r.currentOccupancy || 0;
  });

  const labels = Object.keys(blockMap).length > 0 ? Object.keys(blockMap) : ['Block A', 'Block B', 'Block C'];
  const capacities = labels.map(l => blockMap[l] ? blockMap[l].capacity : 120);
  const occupancies = labels.map(l => blockMap[l] ? blockMap[l].occupancy : 112);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Bed Capacity',
        data: capacities,
        backgroundColor: '#e2e8f0', // Slate 200
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 16
      },
      {
        label: 'Occupied Beds',
        data: occupancies,
        backgroundColor: '#4f46e5', // Indigo 600
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 16
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 10,
          font: { size: 10, weight: 'bold' as const },
          color: '#475569'
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 11, family: 'monospace' },
        bodyFont: { size: 12, weight: 'bold' as const },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 11, weight: 'bold' as const },
          color: '#334155'
        }
      },
      y: {
        grid: {
          color: '#f1f5f9'
        },
        ticks: {
          font: { size: 10 },
          color: '#64748b'
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
