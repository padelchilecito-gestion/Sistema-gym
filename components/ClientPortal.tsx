import React, { useState, useEffect } from 'react';
import { Client, GymSettings, CheckIn, Routine } from '../types';
import { QrCode, Trophy, Activity, Calendar, User, LogOut, Flame, Clock, Dumbbell, CheckCircle } from 'lucide-react';

interface ClientPortalProps {
  client: Client; 
  settings: GymSettings;
  checkIns: CheckIn[];
  routines: Routine[];
  onLogout: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ client, settings, checkIns, routines, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'qr' | 'profile'>('home');
  const [qrCode, setQrCode] = useState('');
  
  // Detectar si el cliente está actualmente entrenando (CheckIn sin salida)
  const activeSession = checkIns.find(c => c.clientId === client.id && !c.checkoutTimestamp);
  const isTraining = !!activeSession;

  // Cronómetro de sesión
  const [sessionDuration, setSessionDuration] = useState('00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      setQrCode(Math.random().toString(36).substring(2, 10).toUpperCase());
      
      if (activeSession) {
        const start = new Date(activeSession.timestamp).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((now - start) / 1000);
        const m = Math.floor(diff / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        setSessionDuration(`${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  // Buscar rutina asignada
  const myRoutine = routines.find(r => r.id === client.assignedRoutineId);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative pb-20 flex flex-col">
        
        {/* Mobile Header */}
        <div className={`p-6 rounded-b-3xl shadow-lg z-10 relative overflow-hidden transition-colors duration-500 ${isTraining ? 'bg-emerald-600' : 'bg-slate-900'} text-white`}>
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
                <p className="text-white/80 text-sm">{isTraining ? '¡A darle duro!' : 'Bienvenido de nuevo,'}</p>
                <h2 className="text-2xl font-bold">{client.name}</h2>
                
                {isTraining && (
                  <div className="mt-4 flex items-center gap-2 bg-white/20 backdrop-blur-md p-2 rounded-lg inline-flex animate-pulse">
                    <Clock size={16} />
                    <span className="font-mono font-bold tracking-widest">{sessionDuration}</span>
                  </div>
                )}
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {activeTab === 'home' && (
                <>
                    {/* MODO ENTRENAMIENTO ACTIVO */}
                    {isTraining ? (
                      <div className="space-y-6">
                        <div className="bg-white border-l-4 border-emerald-500 shadow-md p-4 rounded-r-xl">
                          <h3 className="text-emerald-700 font-bold flex items-center gap-2 mb-2">
                            <Dumbbell size={20} /> Rutina del Día
                          </h3>
                          {myRoutine ? (
                            <div>
                              <p className="text-xl font-bold text-slate-800">{myRoutine.name}</p>
                              <p className="text-slate-500 text-sm mb-2">{myRoutine.description}</p>
                              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-medium">
                                {myRoutine.exercisesCount} Ejercicios
                              </span>
                            </div>
                          ) : (
                            <p className="text-slate-400 text-sm italic">No tienes rutina asignada. ¡Consulta a tu instructor!</p>
                          )}
                        </div>

                        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white shadow-lg flex justify-between items-center">
                           <div>
                             <p className="text-orange-100 text-sm">Puntos ganados hoy</p>
                             <p className="text-3xl font-bold">+50</p>
                           </div>
                           <Trophy size={40} className="text-white/50" />
                        </div>
                      </div>
                    ) : (
                      /* MODO REPOSO (AFUERA) */
                      <div className="text-center py-10">
                        <div className="bg-slate-50 p-6 rounded-full inline-block mb-4">
                          <QrCode size={64} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">¿Listo para entrenar?</h3>
                        <p className="text-slate-500 text-sm mt-2 px-8">
                          Acércate a recepción y muestra tu código QR para activar tu sesión.
                        </p>
                        <button onClick={() => setActiveTab('qr')} className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
                          Mostrar mi Pase
                        </button>
                      </div>
                    )}

                    {/* Stats Card (Siempre visible) */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mt-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Nivel GymFlow</p>
                                <h3 className="text-2xl font-bold flex items-center gap-2 text-indigo-600">{client.level}</h3>
                            </div>
                            <div className="text-center">
                                <Flame className="mx-auto mb-1 text-orange-500" size={24} fill="currentColor" />
                                <span className="font-bold text-lg text-slate-800">{client.streak}</span>
                                <p className="text-[10px] text-slate-400 uppercase">Racha Días</p>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                           <div className="bg-indigo-500 h-full rounded-full" style={{width: `${(client.points % 1000) / 10}%`}}></div>
                        </div>
                        <p className="text-right text-[10px] text-slate-400 mt-1">{client.points} / 1000 pts</p>
                    </div>
                </>
            )}

            {activeTab === 'qr' && (
                <div className="flex flex-col items-center justify-center h-full py-4">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Pase de Acceso</h3>
                    <p className="text-slate-500 text-sm mb-8 text-center">Muestra este código al instructor</p>
                    
                    <div className="bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-2xl relative">
                        <QrCode size={200} className="text-slate-900" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 px-4 py-2 rounded font-mono font-bold text-xl tracking-widest shadow-sm">
                            {qrCode}
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 bg-slate-200 px-4 py-2 rounded-full">
                        <Activity size={12} className="animate-spin" />
                        Token seguro actualizándose...
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
                            <span className="text-slate-500">Saldo</span>
                            <span className={`font-bold ${client.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ${client.balance}
                            </span>
                        </div>
                     </div>
                </div>
            )}
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 p-2 px-6 flex justify-between items-center z-20 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}>
                <Activity size={24} /> <span className="text-[10px] font-medium mt-1">Inicio</span>
            </button>
            <button onClick={() => setActiveTab('qr')} className="flex flex-col items-center justify-center -mt-8 bg-slate-900 text-white w-14 h-14 rounded-full shadow-lg shadow-slate-400/50 hover:scale-105 transition-transform">
                <QrCode size={24} />
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}>
                <User size={24} /> <span className="text-[10px] font-medium mt-1">Perfil</span>
            </button>
        </div>
      </div>
    </div>
  );
};
