import React, { useState, useEffect } from 'react';
import { Client, GymSettings, CheckIn, Routine, Exercise } from '../types';
import { QrCode, Trophy, Activity, User, LogOut, Flame, Clock, Dumbbell, CheckCircle, Circle, CheckSquare } from 'lucide-react';

interface ClientPortalProps {
  client: Client; 
  settings: GymSettings;
  checkIns: CheckIn[];
  routines: Routine[];
  onLogout: () => void;
  onCompleteSession: (pointsEarned: number) => void; // NUEVO: Función para guardar puntos
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ client, settings, checkIns, routines, onLogout, onCompleteSession }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'qr' | 'profile'>('home');
  const activeSession = checkIns.find(c => c.clientId === client.id && !c.checkoutTimestamp);
  const isTraining = !!activeSession;
  
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [isSessionFinished, setIsSessionFinished] = useState(false); // Estado visual

  const myRoutine = routines.find(r => r.id === client.assignedRoutineId);
  let dayOfRoutine = 1;
  if (client.routineStartDate) {
      const start = new Date(client.routineStartDate).getTime();
      const now = new Date().getTime();
      const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      dayOfRoutine = (diffDays % 7) + 1; 
  }

  const toggleExercise = (exId: string) => {
    const newSet = new Set(completedExercises);
    if (newSet.has(exId)) newSet.delete(exId);
    else newSet.add(exId);
    setCompletedExercises(newSet);
  };

  const handleFinishWorkout = () => {
    // Cálculo de puntos: 10 pts base + 5 pts por ejercicio completado
    const points = 10 + (completedExercises.size * 5);
    
    if (window.confirm(`¡Bien hecho! Has completado ${completedExercises.size} ejercicios.\n\n¿Terminar entrenamiento y canjear ${points} puntos?`)) {
      onCompleteSession(points);
      setIsSessionFinished(true);
      setCompletedExercises(new Set()); // Reset
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative pb-20 flex flex-col">
        {/* Header */}
        <div className={`p-6 rounded-b-3xl shadow-lg z-10 relative transition-colors duration-500 ${isTraining ? 'bg-emerald-600' : 'bg-slate-900'} text-white`}>
            <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">{settings.name}</span>
                <button onClick={onLogout}><LogOut size={18} /></button>
            </div>
            <h2 className="text-2xl font-bold">{client.name}</h2>
            <div className="flex items-center gap-4 mt-2">
               {isTraining && <div className="flex items-center gap-2 text-sm animate-pulse"><Clock size={14}/> Entrenando...</div>}
               <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-xs font-bold"><Trophy size={12} className="text-yellow-300"/> {client.points} pts</div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'home' && (
                <>
                    {/* TARJETA DE RUTINA */}
                    <div className="bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <div><h3 className="text-slate-800 font-bold flex items-center gap-2"><Dumbbell size={18} className="text-indigo-600"/> Rutina Hoy</h3></div>
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">Día {dayOfRoutine}</span>
                        </div>
                        
                        <div className="p-0">
                            {myRoutine && myRoutine.exercises && myRoutine.exercises.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {myRoutine.exercises.map((ex, idx) => {
                                        const exKey = ex.name + idx; 
                                        const isDone = completedExercises.has(exKey);
                                        return (
                                            <div key={idx} onClick={() => toggleExercise(exKey)} className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isDone ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                                                <div className={`flex-1 ${isDone ? 'opacity-50' : ''}`}>
                                                    <p className={`font-bold text-sm ${isDone ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{ex.name}</p>
                                                    <div className="flex gap-3 mt-1 text-xs text-slate-500">
                                                        <span className="bg-slate-100 px-1.5 rounded border border-slate-200">{ex.sets}x{ex.reps}</span>
                                                        {ex.machine && <span className="text-blue-500">{ex.machine}</span>}
                                                    </div>
                                                </div>
                                                <div className={`ml-3 ${isDone ? 'text-emerald-500' : 'text-slate-300'}`}>{isDone ? <CheckCircle size={24} fill="currentColor" className="text-emerald-100" /> : <Circle size={24} />}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center"><p className="text-slate-400 text-sm italic">Sin rutina asignada.</p></div>
                            )}
                        </div>
                        
                        {/* Botón Finalizar */}
                        {myRoutine && (
                          <div className="p-4 bg-slate-50 border-t border-slate-100">
                             <button onClick={handleFinishWorkout} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                               <CheckSquare size={18} /> Terminar y Sumar Puntos
                             </button>
                          </div>
                        )}
                    </div>
                    
                    {/* Racha */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-xl shadow-lg flex justify-between items-center text-white">
                        <div>
                          <p className="text-orange-100 text-xs uppercase font-bold">Tu Racha Actual</p>
                          <p className="text-3xl font-bold flex items-center gap-2">{client.streak} <span className="text-base font-normal">días</span></p>
                        </div>
                        <Flame className="text-white animate-pulse" size={40} fill="currentColor" />
                    </div>
                </>
            )}
            
            {activeTab === 'qr' && (
                <div className="flex flex-col items-center py-10">
                    <QrCode size={200} className="text-slate-900" />
                    <p className="mt-4 text-slate-500 text-sm">Acceso al Gym</p>
                </div>
            )}
            {activeTab === 'profile' && (
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <p className="font-bold text-slate-800">Mis Datos</p>
                    <div className="text-sm text-slate-600 flex justify-between border-b py-2"><span>Plan:</span> <span className="font-medium">{client.plan}</span></div>
                    <div className="text-sm text-slate-600 flex justify-between py-2"><span>Saldo:</span> <span className={client.balance < 0 ? 'text-red-500 font-bold' : 'text-green-600'}>${client.balance}</span></div>
                </div>
            )}
        </div>

        {/* Nav */}
        <div className="absolute bottom-0 w-full bg-white border-t p-2 flex justify-around pb-4">
            <button onClick={()=>setActiveTab('home')} className={`flex flex-col items-center ${activeTab==='home'?'text-blue-600':'text-slate-400'}`}><Activity/><span className="text-[10px]">Rutina</span></button>
            <button onClick={()=>setActiveTab('qr')} className="bg-slate-900 text-white p-3 rounded-full -mt-8 shadow-lg"><QrCode/></button>
            <button onClick={()=>setActiveTab('profile')} className={`flex flex-col items-center ${activeTab==='profile'?'text-blue-600':'text-slate-400'}`}><User/><span className="text-[10px]">Perfil</span></button>
        </div>
      </div>
    </div>
  );
};
