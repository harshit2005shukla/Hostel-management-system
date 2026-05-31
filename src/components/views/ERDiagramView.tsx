import React, { useState } from 'react';
import { Share2, ArrowRight } from 'lucide-react';
import { ER_DIAGRAM_TEXT } from '../../data/architectureData';

export const ERDiagramView: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<string>('USERS');

  const entities = [
    {
      name: 'USERS',
      type: 'Core Identity',
      color: 'bg-indigo-600',
      fields: ['_id (PK)', 'email (UQ)', 'passwordHash', 'role', 'status'],
      links: [{ target: 'STUDENTS', relation: '1-to-1 (Identity Anchor)' }]
    },
    {
      name: 'STUDENTS',
      type: 'Domain Entity',
      color: 'bg-emerald-600',
      fields: ['_id (PK)', 'user (FK)', 'enrollmentNo (UQ)', 'course', 'currentRoom (FK)'],
      links: [
        { target: 'USERS', relation: 'References User._id' },
        { target: 'ALLOCATIONS', relation: '1-to-Many' },
        { target: 'COMPLAINTS', relation: '1-to-Many' },
        { target: 'VISITORS', relation: '1-to-Many' },
        { target: 'ROOMS', relation: 'Many-to-One' }
      ]
    },
    {
      name: 'ROOMS',
      type: 'Physical Asset',
      color: 'bg-amber-600',
      fields: ['_id (PK)', 'roomNumber (UQ)', 'hostelBlock', 'capacity', 'status'],
      links: [
        { target: 'ALLOCATIONS', relation: '1-to-Many' },
        { target: 'STUDENTS', relation: 'Holds up to Capacity limit' }
      ]
    },
    {
      name: 'ALLOCATIONS',
      type: 'Join Entity',
      color: 'bg-rose-600',
      fields: ['_id (PK)', 'student (FK)', 'room (FK)', 'bedIdentifier', 'status'],
      links: [
        { target: 'STUDENTS', relation: 'References Student._id' },
        { target: 'ROOMS', relation: 'References Room._id' }
      ]
    },
    {
      name: 'COMPLAINTS',
      type: 'Workflow Entity',
      color: 'bg-purple-600',
      fields: ['_id (PK)', 'student (FK)', 'room (FK)', 'priority', 'status'],
      links: [
        { target: 'STUDENTS', relation: 'References Student._id' },
        { target: 'ROOMS', relation: 'References Room._id' }
      ]
    },
    {
      name: 'VISITORS',
      type: 'Security Log',
      color: 'bg-teal-600',
      fields: ['_id (PK)', 'visitorName', 'studentToVisit (FK)', 'checkInTime', 'status'],
      links: [
        { target: 'STUDENTS', relation: 'References Student._id' }
      ]
    },
    {
      name: 'FEES',
      type: 'Financial Ledger',
      color: 'bg-blue-600',
      fields: ['_id (PK)', 'student (FK)', 'feeType', 'amount', 'status', 'dueDate'],
      links: [
        { target: 'STUDENTS', relation: 'References Student._id' }
      ]
    }
  ];

  const currentEnt = entities.find(e => e.name === selectedEntity) || entities[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview Block */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Entity Relationship Diagram (ERD)</h2>
        <p className="text-sm text-slate-600 mt-1">
          Visualizes primary and foreign key references mapped out across the core collections.
        </p>
      </div>

      {/* Interactive Entity Explorer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Top Entity Tabs */}
        <div className="bg-slate-900 p-4 border-b border-slate-800 flex flex-wrap gap-2">
          {entities.map((ent) => {
            const isActive = selectedEntity === ent.name;
            return (
              <button
                key={ent.name}
                onClick={() => setSelectedEntity(ent.name)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-mono transition-all
                  ${isActive 
                    ? `${ent.color} text-white font-bold shadow-sm` 
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }
                `}
              >
                {ent.name}
              </button>
            );
          })}
        </div>

        {/* Selected Entity Visualizer */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Entity Schema Card */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${currentEnt.color}`} />
              <h3 className="text-sm font-bold text-slate-900 font-mono">{currentEnt.name}</h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {currentEnt.type}
              </span>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Primary & Indexed Attributes</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentEnt.fields.map((f, i) => (
                  <span key={i} className="bg-white text-slate-800 font-mono text-xs px-2 py-1 rounded border border-slate-200">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Outbound & Inbound Cross-Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Entity Relationships & References
            </h4>

            <div className="space-y-2">
              {currentEnt.links.map((link, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 font-mono">{currentEnt.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="font-bold text-indigo-600 font-mono">{link.target}</span>
                  </div>
                  
                  <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-100">
                    {link.relation}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Raw Text ER Diagram */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Share2 className="h-4 w-4 text-indigo-400" />
          <span>Complete ASCII ER Diagram (Text Format)</span>
        </div>

        <div className="bg-slate-950 text-amber-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
          <pre className="leading-relaxed whitespace-pre font-mono">
            {ER_DIAGRAM_TEXT}
          </pre>
        </div>
      </div>

    </div>
  );
};
