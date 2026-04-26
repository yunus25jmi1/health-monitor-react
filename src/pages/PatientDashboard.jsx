import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { Heart, Droplets, Thermometer, Clock, Download, FileText } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const patientId = user?.id || user?.user_id;

  // Poll for latest readings every 5 seconds
  const { data: latestReading } = useQuery({
    queryKey: ['latestReading', patientId],
    queryFn: async () => {
      console.log('Fetching readings for patient ID:', patientId);
      const response = await api.get(`/readings/latest/${patientId}`);
      return response.data.data;
    },
    refetchInterval: 5000,
    enabled: !!patientId,
  });

  // Fetch report history
  const { data: reports } = useQuery({
    queryKey: ['reports', patientId],
    queryFn: async () => {
      const response = await api.get(`/reports/patient/${patientId}`);
      return response.data.data || [];
    },
    enabled: !!patientId,
  });

  const downloadPDF = async (reportId) => {
    try {
      const response = await api.get(`/reports/${reportId}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('PDF Download failed:', err);
      alert('Could not download PDF. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name || user?.email}</h1>
            <p className="text-slate-500">Your health overview for today (ID: {user?.id || user?.user_id})</p>
          </div>
          <div className="flex items-center space-x-2 text-sm font-medium text-slate-400">
            <Clock className="w-4 h-4" />
            <span>Last sync: {latestReading ? new Date(latestReading.recorded_at).toLocaleTimeString() : 'Never'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        {/* Live Vitals Grid */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ActivityIcon className="text-primary-600" /> Live Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <VitalCard 
              label="Heart Rate" 
              value={latestReading?.bpm || '--'} 
              unit="BPM" 
              icon={<Heart className="w-6 h-6 text-red-500" />}
              trend="Normal"
            />
            <VitalCard 
              label="Blood Oxygen" 
              value={latestReading?.spo2 || '--'} 
              unit="%" 
              icon={<Droplets className="w-6 h-6 text-blue-500" />}
              trend="Good"
            />
            <VitalCard 
              label="Temperature" 
              value={latestReading?.temp || '--'} 
              unit="°C" 
              icon={<Thermometer className="w-6 h-6 text-orange-500" />}
              trend="Stable"
            />
            <VitalCard 
              label="Glucose" 
              value={latestReading?.glucose_level || '--'} 
              unit="mg/dL" 
              icon={<ActivityIcon className="w-6 h-6 text-purple-500" />}
              trend="Monitored"
            />
          </div>
        </section>

        {/* Health Journey / Reports */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="text-primary-600" /> Health Reports
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {reports && reports.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <div key={report.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Medical Report #{report.id}</h4>
                        <p className="text-sm text-slate-500">Approved by Dr. Smith • {new Date(report.approved_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => downloadPDF(report.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                No medical reports available yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const VitalCard = ({ label, value, unit, icon, trend }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>
    </div>
    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</h4>
    <div className="flex items-baseline space-x-1 mt-1">
      <span className="text-4xl font-bold text-slate-900">{value}</span>
      <span className="text-slate-400 font-medium">{unit}</span>
    </div>
  </div>
);

const ActivityIcon = ({ className }) => (
  <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default PatientDashboard;
