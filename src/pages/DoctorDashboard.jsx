import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { 
  Users, AlertCircle, CheckCircle, ChevronRight, 
  Search, Bell, LogOut, LayoutDashboard, FileEdit 
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchId, setSearchId] = useState('');
  const queryClient = useQueryClient();

  // Fetch pending reports (Urgency Queue)
  const { data: pendingReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['pendingReports'],
    queryFn: async () => {
      const response = await api.get('/reports/pending');
      return response.data.data || [];
    },
    enabled: activeTab === 'dashboard',
  });

  // Fetch specific patient data
  const { data: patients, isLoading: patientsLoading, error: patientError } = useQuery({
    queryKey: ['patients', searchId],
    queryFn: async () => {
      if (!searchId) return [];
      try {
        if (searchId === user?.id?.toString()) {
          throw new Error('You cannot search for your own records as a patient.', { cause: 'self_search' });
        }
        const response = await api.get(`/readings/latest/${searchId}`);
        return response.data.data ? [response.data.data] : [];
      } catch (err) {
        if (err.cause === 'self_search') {
          throw err;
        }
        if (err.response?.status === 403) {
          throw new Error('You are not authorized to view this patient. They may not be assigned to you.', { cause: err });
        }
        throw err;
      }
    },
    enabled: activeTab === 'patients' && !!searchId,
    retry: false,
  });

  // Mutation for approving reports
  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }) => {
      await api.post(`/reports/${id}/approve`, { final_note: notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingReports']);
      setSelectedReport(null);
      setDoctorNotes('');
      alert('Report approved and PDF generated!');
    },
  });

  // Mutation for dismissing reports
  const dismissMutation = useMutation({
    mutationFn: async (id) => {
      await api.patch(`/reports/${id}`, { status: 'dismissed' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingReports']);
      setSelectedReport(null);
      setDoctorNotes('');
    },
  });

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">SmartHealth</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <div onClick={() => setActiveTab('dashboard')}>
            <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} />
          </div>
          <div onClick={() => setActiveTab('dashboard')}>
            <SidebarItem icon={<AlertCircle size={20} />} label="Urgent Alerts" count={pendingReports?.filter(r => r.is_urgent).length} />
          </div>
          <div onClick={() => setActiveTab('patients')}>
            <SidebarItem icon={<Users size={20} />} label="Patient Directory" active={activeTab === 'patients'} />
          </div>
          <SidebarItem icon={<CheckCircle size={20} />} label="Finalized Reports" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 w-full p-3 text-slate-500 hover:bg-slate-50 hover:text-red-600 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients, reports..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-full relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l pl-4 ml-4">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs font-medium text-slate-500">Chief Medical Officer</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <header>
              <h2 className="text-3xl font-bold text-slate-900">
                {activeTab === 'dashboard' ? 'Clinical Dashboard' : 'Patient Directory'}
              </h2>
              <p className="text-slate-500 mt-1">
                {activeTab === 'dashboard' 
                  ? 'Review pending reports and prioritize urgent patient alerts.' 
                  : 'Manage and monitor your assigned patient population.'}
              </p>
            </header>

            {activeTab === 'dashboard' ? (
              <>
                {/* Urgency Queue */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <AlertCircle size={18} className="text-red-500" /> Urgency Queue
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {pendingReports?.length || 0} Pending Review
                    </span>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {reportsLoading ? (
                      <div className="p-12 text-center text-slate-400 italic">Loading queue...</div>
                    ) : pendingReports?.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 italic">No pending reports. All clear!</div>
                    ) : (
                      pendingReports.map((report) => (
                        <div 
                          key={report.id} 
                          className={`p-6 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${selectedReport?.id === report.id ? 'bg-primary-50/30' : ''}`}
                          onClick={() => setSelectedReport(report)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.is_urgent ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                              <Users size={24} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900">{report.patient_name}</h4>
                                {report.is_urgent && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-md tracking-tighter">Urgent</span>
                                )}
                              </div>
                              <p className="text-sm text-slate-500">ID: P-00{report.patient_id} • Vital Alert triggered {new Date(report.created_at).toLocaleTimeString()}</p>
                            </div>
                          </div>
                          <ChevronRight className="text-slate-300" size={20} />
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </>
            ) : (
              <div className="space-y-6">
                <div className="max-w-md">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Search Patient by ID</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="Enter Patient ID..."
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                </div>

                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {patientsLoading ? (
                      <div className="p-12 text-center text-slate-400 italic">Loading patient data...</div>
                    ) : patientError ? (
                      <div className="p-12 text-center text-red-500 font-medium">
                        {patientError.message}
                      </div>
                    ) : (!patients || patients.length === 0) ? (
                      <div className="p-12 text-center text-slate-400 italic">Enter a valid Patient ID to view data.</div>
                    ) : (
                      patients.map((patient) => (
                        <div key={patient.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                              <Users size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900">Patient #{patient.patient_id}</h4>
                              <p className="text-sm text-slate-500">Latest Vital sync: {new Date(patient.recorded_at).toLocaleTimeString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase">Heart Rate</p>
                                <p className="font-black text-slate-700">{patient.bpm} BPM</p>
                             </div>
                             <ChevronRight className="text-slate-300" size={20} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* Report Review Interface (Conditional) */}
            {selectedReport && (
              <section className="animate-in slide-in-from-bottom-4 duration-500 bg-white rounded-3xl border-2 border-primary-500/20 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]">
                <div className="flex-1 p-8 border-r border-slate-100 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Review AI Draft</h3>
                      <p className="text-slate-500">Patient: {selectedReport.patient_name}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-4">
                       <VitalBrief label="BPM" value="102" urgent />
                       <VitalBrief label="SpO2" value="94" urgent />
                       <VitalBrief label="Temp" value="38.2" />
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-slate-50 rounded-2xl p-6 font-mono text-sm overflow-auto border border-slate-200">
                    <div className="prose prose-slate max-w-none">
                      {selectedReport.ai_draft}
                    </div>
                  </div>
                </div>

                <aside className="w-80 p-8 bg-slate-50/50 flex flex-col">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FileEdit size={18} className="text-primary-600" /> Doctor Notes
                    </h4>
                    <textarea 
                      className="w-full h-48 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                      placeholder="Add clinical observations or modify AI summary..."
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                    ></textarea>
                    
                    <div className="mt-8 space-y-4">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Decision</p>
                       <button 
                        onClick={() => approveMutation.mutate({ id: selectedReport.id, notes: doctorNotes })}
                        disabled={approveMutation.isLoading}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
                       >
                         {approveMutation.isLoading ? 'Processing...' : <><CheckCircle size={20} /> Approve & Sign</>}
                       </button>
                       <button 
                        onClick={() => dismissMutation.mutate(selectedReport.id)}
                        disabled={dismissMutation.isLoading}
                        className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                       >
                         {dismissMutation.isLoading ? 'Dismissing...' : 'Dismiss'}
                       </button>
                    </div>
                  </div>
                </aside>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, count }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-primary-50 text-primary-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    {count > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full">{count}</span>}
  </div>
);

const VitalBrief = ({ label, value, urgent }) => (
  <div className="text-center">
    <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
    <p className={`text-sm font-black ${urgent ? 'text-red-600' : 'text-slate-700'}`}>{value}</p>
  </div>
);

export default DoctorDashboard;
