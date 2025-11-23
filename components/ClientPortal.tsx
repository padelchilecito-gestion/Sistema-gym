// ... (Imports anteriores + Routine)
import React, { useState, useEffect } from 'react';
import { Client, GymSettings, CheckIn, Routine } from '../types';
import { QrCode, Trophy, Activity, User, LogOut, Flame, Clock, Dumbbell } from 'lucide-react';

interface ClientPortalProps {
  client: Client; 
  settings: GymSettings;
  checkIns: CheckIn[];
  routines: Routine[];
  onLogout: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ client, settings, checkIns, routines, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'qr' | 'profile'>('home');
  const activeSession = checkIns.find(c => c.clientId === client.id && !c.checkoutTimestamp);
  const isTraining = !!activeSession;
  
  // Calcular día de rutina
  const myRoutine = routines.find(r => r.id === client.assignedRoutineId);
  let dayOfRoutine = 1;
  if (client.routineStartDate) {
      const start = new Date(client.routineStartDate).getTime();
      const now = new Date().getTime();
      const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      dayOfRoutine = (diffDays % 7) + 1; // Ciclo semanal (1 a 7)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative pb-20 flex flex-col">
        {/* Header con Session Status */}
        <div className={`p-6 rounded-b-3xl shadow-lg z-10 relative transition-colors duration-500 ${isTraining ? 'bg-emerald-600' : 'bg-slate-900'} text-white`}>
            <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">{settings.name}</span>
                <button onClick={onLogout}><LogOut size={18} /></button>
            </div>
            <h2 className="text-2xl font-bold">{client.name}</h2>
            {isTraining && <div className="mt-2 flex items-center gap-2 text-sm"><Clock size={14}/> Entrenando ahora...</div>}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'home' && (
                <>
                    {/* TARJETA DE RUTINA INTELIGENTE */}
                    <div className="bg-white border-l-4 border-indigo-500 shadow-md p-5 rounded-r-xl">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-indigo-900 font-bold flex items-center gap-2"><Dumbbell size={20}/> Rutina del Día</h3>
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">Día {dayOfRoutine}</span>
                        </div>
                        {myRoutine ? (
                            <div>
                                <p className="text-lg font-bold text-slate-800">{myRoutine.name}</p>
                                <p className="text-slate-500 text-sm mt-1">{myRoutine.description}</p>
                                <div className="mt-3 text-xs text-slate-400 uppercase font-bold tracking-wide">Enfoque de hoy: Fuerza</div>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm italic">Sin rutina asignada.</p>
                        )}
                    </div>
                    
                    {/* Stats */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                        <div><p className="text-slate-500 text-xs">Puntos Acumulados</p><p className="text-2xl font-bold text-slate-800">{client.points}</p></div>
                        <Trophy className="text-yellow-500" size={32} />
                    </div>
                </>
            )}
            {/* (QR y Profile se mantienen igual que antes para brevedad) */}
            {activeTab === 'qr' && (
                <div className="flex flex-col items-center py-10">
                    <QrCode size={200} className="text-slate-900" />
                    <p className="mt-4 text-slate-500 text-sm">Muestra este código en recepción</p>
                </div>
            )}
            {activeTab === 'profile' && (
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <p className="font-bold text-slate-800 mb-2">Mis Datos</p>
                    <p className="text-sm text-slate-600">Plan: {client.plan}</p>
                    <p className="text-sm text-slate-600">Saldo: ${client.balance}</p>
                </div>
            )}
        </div>

        {/* Nav */}
        <div className="absolute bottom-0 w-full bg-white border-t p-2 flex justify-around pb-4">
            <button onClick={()=>setActiveTab('home')} className={`flex flex-col items-center ${activeTab==='home'?'text-blue-600':'text-slate-400'}`}><Activity/><span className="text-[10px]">Inicio</span></button>
            <button onClick={()=>setActiveTab('qr')} className="bg-slate-900 text-white p-3 rounded-full -mt-8 shadow-lg"><QrCode/></button>
            <button onClick={()=>setActiveTab('profile')} className={`flex flex-col items-center ${activeTab==='profile'?'text-blue-600':'text-slate-400'}`}><User/><span className="text-[10px]">Perfil</span></button>
        </div>
      </div>
    </div>
  );
};
