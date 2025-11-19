import React, { useState } from 'react';
import { GymSettings, SubscriptionPlan } from '../types';
import { Building2, Save, ShieldCheck, Star, Zap, Lock, Unlock, X } from 'lucide-react';

interface SettingsProps {
  settings: GymSettings;
  onUpdateSettings: (settings: GymSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState<GymSettings>(settings);
  
  // State for Security Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null);
  const [error, setError] = useState('');

  // Hardcoded Super Admin Password for Demo
  const SUPER_ADMIN_PASSWORD = 'admin';

  const initiatePlanChange = (plan: SubscriptionPlan) => {
    if (plan === formData.plan) return; // No change needed
    setPendingPlan(plan);
    setPasswordInput('');
    setError('');
    setIsAuthModalOpen(true);
  };

  const verifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: trim whitespace to avoid errors with copy-paste or mobile keyboards
    if (passwordInput.trim() === SUPER_ADMIN_PASSWORD) {
      if (pendingPlan) {
        setFormData({ ...formData, plan: pendingPlan });
      }
      setIsAuthModalOpen(false);
      setPendingPlan(null);
      setPasswordInput('');
    } else {
      setError('Contraseña incorrecta. Acceso denegado.');
    }
  };

  const handleSave = () => {
    onUpdateSettings(formData);
    alert('Configuración guardada exitosamente');
  };

  const PlanCard = ({ type, price, features, icon: Icon, color }: any) => (
    <div 
      onClick={() => initiatePlanChange(type)}
      className={`cursor-pointer border-2 rounded-xl p-6 transition-all relative overflow-hidden group
        ${formData.plan === type ? `border-${color}-500 bg-${color}-50 shadow-md` : 'border-slate-200 hover:border-slate-300 bg-white'}
      `}
    >
      {formData.plan === type && (
        <div className={`absolute top-0 right-0 bg-${color}-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg`}>
          ACTIVO
        </div>
      )}
      
      {/* Lock Icon Overlay on Hover for non-active plans */}
      {formData.plan !== type && (
        <div className="absolute top-2 right-2 text-slate-300 group-hover:text-slate-500 transition-colors">
          <Lock size={16} />
        </div>
      )}

      <div className={`w-12 h-12 rounded-lg bg-${color}-100 text-${color}-600 flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1">{type}</h3>
      <p className="text-slate-500 text-sm mb-4">{price}</p>
      <ul className="space-y-2">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
            <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500`} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-5xl mx-auto">
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="text-slate-600" />
                Configuración del Gimnasio
            </h2>
            <p className="text-slate-500 mt-1">Personaliza la identidad de tu negocio y gestiona tu suscripción.</p>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Gimnasio</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">URL del Logo</label>
                    <input 
                        type="text" 
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                        placeholder="https://..."
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
            </div>
            
            {/* Branding Preview */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center border border-slate-100 overflow-hidden">
                    {formData.logoUrl ? <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <Building2 className="text-slate-300" />}
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Vista Previa</p>
                    <p className="text-xl font-bold text-slate-800">{formData.name || 'Nombre del Gym'}</p>
                </div>
            </div>
        </div>
      </div>

      {/* SaaS Plan Selector */}
      <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-slate-800">Plan de Suscripción GymFlow</h3>
            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
               <Lock size={10} /> Zona Segura
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlanCard 
                type="Basic" 
                price="$29/mes" 
                color="slate"
                icon={ShieldCheck}
                features={['Gestión de Clientes', 'Contabilidad Básica', 'Cobranzas Simples', 'Dashboard']}
              />
              <PlanCard 
                type="Standard" 
                price="$59/mes" 
                color="blue"
                icon={Zap}
                features={['Todo lo de Básico +', 'CRM & Marketing', 'Control de Acceso', 'Portal Clientes']}
              />
              <PlanCard 
                type="Full" 
                price="$99/mes" 
                color="purple"
                icon={Star}
                features={['Todo lo de Estándar +', 'Gamificación', 'Entrenamientos', 'Inventario', 'IA Predictiva']}
              />
          </div>
      </div>

      <div className="flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors font-bold shadow-lg"
          >
              <Save size={20} /> Guardar Cambios
          </button>
      </div>

      {/* Super Admin Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Autenticación Requerida</h3>
              <p className="text-slate-500 text-sm mt-1">
                Para cambiar el plan de suscripción a <span className="font-bold text-indigo-600">{pendingPlan}</span>, ingresa la clave de Super Administrador.
              </p>
            </div>

            <form onSubmit={verifyPassword} className="space-y-4">
              <div>
                <input 
                  type="password" 
                  placeholder="Contraseña Maestra"
                  className="w-full p-3 text-center text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-800 focus:outline-none tracking-widest"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs mt-2 text-center font-medium">{error}</p>}
              </div>
              
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Unlock size={18} /> Autorizar Cambio
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};