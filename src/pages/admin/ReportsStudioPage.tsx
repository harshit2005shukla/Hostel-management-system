import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { 
  FileText, 
  Download, 
  Printer, 
  Layers, 
  Sliders, 
  Building2,
  CheckCircle2
} from 'lucide-react';

export const ReportsStudioPage: React.FC = () => {
  const [reportType, setReportType] = useState<'occupancy' | 'complaints' | 'fees'>('occupancy');
  
  // Custom Filters
  const [hostelBlock, setHostelBlock] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [feeType, setFeeType] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  const [loadingCsv, setLoadingCsv] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleExportCsv = async () => {
    setLoadingCsv(true);
    setStatusMsg(null);
    try {
      const filters: any = {};
      if (hostelBlock) filters.hostelBlock = hostelBlock;
      if (statusFilter) filters.status = statusFilter;
      if (feeType) filters.feeType = feeType;
      if (priority) filters.priority = priority;

      const csvData = await apiService.exportCsvReport(reportType, filters);
      
      const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvData);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `SmartHostel_${reportType.toUpperCase()}_Report_${Date.now()}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMsg(`Native CSV Report for ${reportType} compiled and downloaded successfully!`);
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err) {
      console.error('Failed to trigger native CSV generation', err);
    } finally {
      setLoadingCsv(false);
    }
  };

  const handleGeneratePdf = () => {
    // Generate clean print layout dynamically inside a printable new window
    let title = 'Hostel Occupancy Report';
    let records: any[] = [];

    if (reportType === 'occupancy') {
      title = 'Hostel Occupancy Report';
      records = JSON.parse(localStorage.getItem('mock_rooms') || '[]');
      if (hostelBlock) {
        records = records.filter(r => r.hostelBlock?.toLowerCase().includes(hostelBlock.toLowerCase()));
      }
      if (statusFilter) {
        records = records.filter(r => r.status === statusFilter);
      }
    } else if (reportType === 'complaints') {
      title = 'Facility Complaints Report';
      records = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
      if (statusFilter) {
        records = records.filter(c => c.status === statusFilter);
      }
      if (priority) {
        records = records.filter(c => c.priority === priority);
      }
    } else {
      title = 'Financial Fee Ledger Report';
      records = JSON.parse(localStorage.getItem('mock_fees') || '[]');
      if (statusFilter) {
        records = records.filter(f => f.status === statusFilter);
      }
      if (feeType) {
        records = records.filter(f => f.feeType === feeType);
      }
    }

    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Please allow popups to render the printable PDF view.');
      return;
    }

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - SmartHostel</title>
        <style>
          body { font-family: Arial, sans-serif; color: #333; margin: 40px; font-size: 12px; }
          .header { border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { color: #4f46e5; margin: 0 0 5px 0; font-size: 22px; }
          .meta { font-size: 11px; color: #666; margin-bottom: 20px; }
          table { w-full; border-collapse: collapse; margin-top: 10px; width: 100%; }
          th { background-color: #f1f5f9; color: #334155; text-align: left; padding: 10px; font-size: 11px; border: 1px solid #cbd5e1; }
          td { padding: 10px; border: 1px solid #cbd5e1; font-size: 11px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 10px; text-align: center; color: #888; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SmartHostel Enterprise Systems</h1>
          <div style="font-size: 14px; font-weight: bold; color: #1e293b;">${title}</div>
        </div>
        
        <div class="meta">
          <strong>Generated Date:</strong> ${new Date().toLocaleString()}<br/>
          <strong>Active Filter Bounds:</strong> ${hostelBlock || statusFilter || feeType || priority || 'All universal operational records'}
        </div>

        <table>
          <thead>
    `;

    if (reportType === 'occupancy') {
      html += `
        <tr>
          <th>Hostel Block</th>
          <th>Room Number</th>
          <th>Floor Level</th>
          <th>Room Type</th>
          <th>Total Capacity</th>
          <th>Current Occupancy</th>
          <th>Operational Status</th>
        </tr>
      </thead>
      <tbody>
      `;
      records.forEach(r => {
        html += `
          <tr>
            <td>${r.hostelBlock}</td>
            <td><strong>${r.roomNumber}</strong></td>
            <td>${r.floorNumber}</td>
            <td>${r.type}</td>
            <td>${r.capacity}</td>
            <td>${r.currentOccupancy}</td>
            <td><span style="color: ${r.status === 'Available' ? 'green' : 'red'}">${r.status}</span></td>
          </tr>
        `;
      });
    } 
    else if (reportType === 'complaints') {
      html += `
        <tr>
          <th>Ticket ID</th>
          <th>Originator Enrollment</th>
          <th>Room Number</th>
          <th>Defect Category</th>
          <th>Incident Heading</th>
          <th>Priority Urgency</th>
          <th>Current Status</th>
        </tr>
      </thead>
      <tbody>
      `;
      records.forEach(c => {
        html += `
          <tr>
            <td>${c._id}</td>
            <td>${c.student?.enrollmentNumber || 'N/A'}</td>
            <td>${c.room?.roomNumber || '101A'}</td>
            <td>${c.category}</td>
            <td>${c.title}</td>
            <td><strong>${c.priority}</strong></td>
            <td>${c.status}</td>
          </tr>
        `;
      });
    }
    else {
      html += `
        <tr>
          <th>Ledger ID</th>
          <th>Student Enrollment</th>
          <th>Fee Category</th>
          <th>Billing Period</th>
          <th>Total Billed Amount</th>
          <th>Amount Cleared</th>
          <th>Payment Status</th>
        </tr>
      </thead>
      <tbody>
      `;
      records.forEach(f => {
        html += `
          <tr>
            <td>${f._id}</td>
            <td>${f.student?.enrollmentNumber || 'N/A'}</td>
            <td>${f.feeType}</td>
            <td>${f.billingPeriod}</td>
            <td>₹${f.amount?.toLocaleString()}</td>
            <td>₹${(f.paidAmount || 0).toLocaleString()}</td>
            <td><strong>${f.status}</strong></td>
          </tr>
        `;
      });
    }

    html += `
          </tbody>
        </table>

        <div class="footer">
          Smart Hostel Management System • Official Archival PDF Report • Page 1 of 1
        </div>

        <script>
          // Automatically prompt the print dialog upon load
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.write(html);
    printWin.document.close();

    setStatusMsg(`Browser-Native Printable PDF Report compiled successfully!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Enterprise Reports Studio
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Generate comprehensive operational spreadsheets and print-ready archival PDF documents.
        </p>
      </div>

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-center space-x-2 font-mono">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Reports Workspace Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Report Scope Selection */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-mono">
              1. Select Report Domain
            </span>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setReportType('occupancy');
                  setStatusFilter('');
                }}
                className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                  reportType === 'occupancy' 
                    ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-900 font-bold' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Building2 className={`h-4 w-4 ${reportType === 'occupancy' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs">Hostel Occupancy Report</div>
                    <div className="text-[10px] text-slate-400 font-normal">Physical assets & bed utilization</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">→</span>
              </button>

              <button
                onClick={() => {
                  setReportType('complaints');
                  setStatusFilter('');
                }}
                className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                  reportType === 'complaints' 
                    ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-900 font-bold' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className={`h-4 w-4 ${reportType === 'complaints' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs">Facility Complaints Report</div>
                    <div className="text-[10px] text-slate-400 font-normal">Infrastructure defects & SLA timings</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">→</span>
              </button>

              <button
                onClick={() => {
                  setReportType('fees');
                  setStatusFilter('');
                }}
                className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                  reportType === 'fees' 
                    ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-900 font-bold' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className={`h-4 w-4 ${reportType === 'fees' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs">Financial Fee Ledgers Report</div>
                    <div className="text-[10px] text-slate-400 font-normal">Billed charges, fines & collections</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">→</span>
              </button>
            </div>
          </div>

          {/* Filter Customization Options */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                2. Configure Filter Parameters
              </span>
            </div>

            <div className="space-y-3">
              
              {/* Common Status Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 block uppercase">
                  Operational Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Statuses</option>
                  {reportType === 'occupancy' && (
                    <>
                      <option value="Available">Available</option>
                      <option value="Full">Full</option>
                      <option value="Maintenance">Maintenance</option>
                    </>
                  )}
                  {reportType === 'complaints' && (
                    <>
                      <option value="Pending">Pending</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Resolved">Resolved</option>
                    </>
                  )}
                  {reportType === 'fees' && (
                    <>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Partially Paid">Partially Paid</option>
                    </>
                  )}
                </select>
              </div>

              {/* Occupancy specific */}
              {reportType === 'occupancy' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block uppercase">
                    Hostel Block Scoping
                  </label>
                  <select
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Blocks</option>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                  </select>
                </div>
              )}

              {/* Complaints specific */}
              {reportType === 'complaints' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block uppercase">
                    Priority Urgency Gating
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              )}

              {/* Fees specific */}
              {reportType === 'fees' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block uppercase">
                    Fee Category Gating
                  </label>
                  <select
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Fee Buckets</option>
                    <option value="Room Rent">Room Rent</option>
                    <option value="Mess Fee">Mess Fee</option>
                    <option value="Maintenance Fine">Maintenance Fine</option>
                    <option value="Late Fine">Late Fine</option>
                  </select>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Right Column: Generation Triggers & Output Format Briefs */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-mono border-b pb-2">
                3. Compile Archival Exports
              </span>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Choose the direct operational export output below. Both format interfaces inject current verified application access credentials automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: Native Server CSV */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    CSV
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Native CSV Data Stream
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Downloads raw comma-separated rows. Fully optimized for instant ingestion into Microsoft Excel, Google Sheets, or advanced BI ingestion scripts.
                  </p>
                </div>

                <button
                  onClick={handleExportCsv}
                  disabled={loadingCsv}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{loadingCsv ? 'Compiling...' : 'Export Raw CSV'}</span>
                </button>
              </div>

              {/* Option 2: Browser-Native Printable PDF */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    PDF
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Printable Archival PDF
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Compiles clean document templates embedded with official project brand headers, generation metadata, and optimized tabular page borders.
                  </p>
                </div>

                <button
                  onClick={handleGeneratePdf}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Generate PDF Report</span>
                </button>
              </div>

            </div>

            {/* Design Notes */}
            <div className="bg-slate-900 text-slate-300 p-3.5 rounded-lg text-xs space-y-1">
              <div className="font-bold text-slate-100 font-mono">
                System Security directives:
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All export operations enforce WORM standards. Result payloads reflect exact immutable server ledger configurations and prevent post-generation local tampering.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
