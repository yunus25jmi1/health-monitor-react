import { Link } from 'react-router-dom';
import { Activity, Shield, Zap, Heart } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Activity className="w-8 h-8 text-primary-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">SmartHealth</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-6 py-2 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
            Login
          </Link>
          <Link to="/login" className="px-6 py-2 text-sm font-semibold text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-all shadow-md hover:shadow-lg">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-8 py-20 lg:py-32 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6">
          Next-Gen <span className="text-primary-600">Health Monitoring</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Secure, real-time vitals tracking powered by ESP32 and AI. Bridging the gap between patients and doctors with clinical precision.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl hover:-translate-y-1">
            Doctor Portal
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-secondary-600 text-white rounded-xl font-bold text-lg hover:bg-secondary-700 transition-all shadow-xl hover:-translate-y-1">
            Patient Access
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="bg-slate-50 py-24 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-yellow-500" />}
            title="Real-time Telemetry"
            description="Instant data transmission from ESP32 sensors (BPM, SpO2, Temp, ECG) to your dashboard."
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-green-500" />}
            title="AI-Powered Insights"
            description="Intelligent anomaly detection and automated health report drafting for clinical review."
          />
          <FeatureCard 
            icon={<Heart className="w-8 h-8 text-red-500" />}
            title="Doctor-in-the-Loop"
            description="Human-verified medical reports ensuring the highest standards of patient care."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
