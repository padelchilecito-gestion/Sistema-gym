import React, { useState } from 'react';
import { Routine, Client } from '../types';
import { Dumbbell, Plus, ChevronRight, UserPlus, Activity, X } from 'lucide-react';

interface WorkoutsProps {
  clients: Client[];
  routines: Routine[];
  addRoutine: (routine: Routine) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
}

export const Workouts: React.FC<WorkoutsProps> = ({ clients, routines, addRoutine, updateClient }) => {
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newRoutine, setNewRoutine] = useState<Partial<Routine>>({ difficulty: 'Intermedio', exercisesCount: 0 });

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if(newRoutine.name) {
        addRoutine({
            id: crypto.randomUUID(),
            name: newRoutine.name,
            description: newRoutine.description || '',
            difficulty: newRoutine.difficulty as any,
            exercisesCount: Number(newRoutine.exercisesCount) || 0
        });
        setCreateModalOpen(false);
        setNewRoutine({ difficulty: 'Intermedio', exercisesCount: 0 });
    }
  };

  const handleAssign = (clientId: string) => {
    if (selectedRoutineId) {
        // NUEVO: Guardamos la fecha de inicio HOY para el cálculo semanal
        updateClient(clientId, { 
            assignedRoutineId: selectedRoutineId,
            routineStartDate: new Date().toISOString() 
        });
        setAssignModalOpen(false);
        alert('Rutina asignada y activada para esta semana.');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex gap-2"><Dumbbell className="text-blue-600"/> Rutinas</h2>
        <button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2"><Plus size={20}/> Nueva</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {routines.map(r => (
            <div key={r.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700">{r.difficulty}</span>
                    <Activity className="text-slate-400" size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2">{r.name}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{r.description}</p>
                <button onClick={() => {setSelectedRoutineId(r.id); setAssignModalOpen(true)}} className="w-full py-2 text-blue-600 font-medium border border-blue-100 rounded-lg hover:bg-blue-50 flex justify-center gap-1">
                    Asignar a Alumno <ChevronRight size={18}/>
                </button>
            </div>
        ))}
      </div>

      {/* Modales Assign y Create (Simplificados para brevedad) */}
      {assignModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e=>e.stopPropagation()}>
              <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between mb-4"><h3 className="font-bold">Asignar a:</h3><button onClick={()=>setAssignModalOpen(false)}><X/></button></div>
                  <div className="space-y-2">
                      {clients.map(c => (
                          <button key={c.id} onClick={() => handleAssign(c.id)} className="w-full text-left p-3 hover:bg-slate-50 rounded border border-slate-100 flex justify-between">
                              <span>{c.name}</span><UserPlus size={16} className="text-slate-400"/>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}
      {createModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e=>e.stopPropagation()}>
              <div className="bg-white p-6 rounded-xl w-full max-w-md">
                  <h2 className="font-bold mb-4">Nueva Rutina</h2>
                  <form onSubmit={handleCreateRoutine} className="space-y-4">
                      <input required placeholder="Nombre" className="w-full p-2 border rounded" value={newRoutine.name} onChange={e=>setNewRoutine({...newRoutine, name:e.target.value})}/>
                      <textarea placeholder="Descripción" className="w-full p-2 border rounded" value={newRoutine.description} onChange={e=>setNewRoutine({...newRoutine, description:e.target.value})}/>
                      <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">Crear</button>
                  </form>
                  <button onClick={()=>setCreateModalOpen(false)} className="w-full mt-2 text-slate-500 text-sm">Cancelar</button>
              </div>
          </div>
      )}
    </div>
  );
};
