import React, { useState, useEffect } from 'react';
import { Client, GymSettings } from '../types';
import { QrCode, Trophy, Activity, Calendar, User, LogOut, Flame } from 'lucide-react';

interface ClientPortalProps {
  client: Client; // In a real app, this would come from auth context
  settings: GymSettings;
  onLogout: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ client, settings, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'qr' | 'profile'>('home');
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setQrCode(Math.random().toString(36).substring(2, 10).toUpperCase());
    }, 5000);
    setQrCode(Math.random().toString(36).substring(2, 10).toUpperCase());
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative pb-20 flex flex-col">
        
        {/* Mobile Header */}
        <div className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-lg z-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity size={100} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 rounded-full bg-white p-1" />}
                    <span className="font-bold text-lg">{settings.name}</span>
                </div>
                <button onClick={onLogout} className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                    <LogOut size={16} />
                </button>
            </div>
            <div className="relative z-10">
                <p className="text-slate-300 text-sm">Bienvenido de nuevo,</p>
                <h2 className="text-2xl font-bold">{client.name}</h2>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {activeTab === 'home' && (
                <>
                    {/* Gamification Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <p className="text-indigo-200 text-sm font-medium mb-1">Nivel Actual</p>
                                <h3 className="text-3xl font-bold flex items-center gap-2">{client.level} <Trophy size={24} className="text-yellow-400" fill="currentColor"/></h3>
                                <p className="mt-2 text-sm bg-white/20 inline-block px-2 py-1 rounded-lg backdrop-blur-sm">
                                    {client.points} Puntos acumulados
                                </p>
                            </div>
                            <div className="text-center">
                                <Flame className="mx-auto mb-1 text-orange-400 animate-pulse" size={32} fill="currentColor" />
                                <span className="font-bold text-xl">{client.streak}</span>
                                <p className="text-xs text-indigo-200">Días Racha</p>
                            </div>
                        </div>
                    </div>

                    {/* Next Workout */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Calendar className="text-blue-500" size={18} /> Próxima Clase
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-700">Crossfit Avanzado</p>
                                <p className="text-sm text-slate-500">18:00 - Sala Principal</p>
                            </div>
                            <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold">
                                Confirmado
                            </button>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'qr' && (
                <div className="flex flex-col items-center justify-center h-full py-10">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Pase de Acceso</h3>
                    <p className="text-slate-500 text-sm mb-8 text-center">Acerca este código al lector para ingresar</p>
                    
                    <div className="bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-2xl relative">
                        <QrCode size={200} className="text-slate-900" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 px-4 py-2 rounded font-mono font-bold text-xl tracking-widest shadow-sm">
                            {qrCode}
                        </div>
                    </div>
                    
                    <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 bg-slate-200 px-4 py-2 rounded-full">
                        <Activity size={12} className="animate-spin" />
                        Actualizando token de seguridad...
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="space-y-4">
                     <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                            <User size={32} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{client.name}</p>
                            <p className="text-slate-500 text-sm">{client.email}</p>
                        </div>
                     </div>
                     
                     <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
                        <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Mi Membresía</h4>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Plan</span>
                            <span className="font-medium text-slate-900">{client.plan}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Estado</span>
                            <span className="font-medium text-green-600 bg-green-50 px-2 rounded">{client.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Saldo Pendiente</span>
                            <span className={`font-bold ${client.balance > 0 ? 'text-red-600' : 'text-slate-900'}`}>${client.balance}</span>
                        </div>
                     </div>
                </div>
            )}

        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 p-2 px-6 flex justify-between items-center z-20 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}
            >
                <Activity size={24} />
                <span className="text-[10px] font-medium mt-1">Inicio</span>
            </button>
            
            <button 
                onClick={() => setActiveTab('qr')}
                className="flex flex-col items-center justify-center -mt-8 bg-slate-900 text-white w-14 h-14 rounded-full shadow-lg shadow-slate-400/50 hover:scale-105 transition-transform"
            >
                <QrCode size={24} />
            </button>
            
            <button 
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}
            >
                <User size={24} />
                <span className="text-[10px] font-medium mt-1">Perfil</span>
            </button>
        </div>

      </div>
    </div>
  );
};