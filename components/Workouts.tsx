import React, { useState } from 'react';
import { Routine, Client } from '../types';
import { Dumbbell, Plus, ChevronRight, UserPlus, Activity, X } from 'lucide-react';

// Aceptamos rutinas desde App.tsx y funciones para editar clientes/rutinas
interface WorkoutsProps {
  clients: Client[];
  routines: Routine[]; // NUEVO
  addRoutine: (routine: Routine) => void; // NUEVO
  updateClient: (id: string, data: Partial<Client>) => void; // NUEVO
}

export const Workouts: React.FC<WorkoutsProps> = ({ clients, routines, addRoutine, updateClient }) => {
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Formulario nueva rutina
  const [newRoutine, setNewRoutine] = useState<Partial<Routine>>({
    difficulty: 'Intermedio',
    exercisesCount: 0
  });

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if(newRoutine.name && newRoutine.description) {
        addRoutine({
            id: crypto.randomUUID(),
            name: newRoutine.name,
            description: newRoutine.description,
            difficulty: newRoutine.difficulty as any,
            exercisesCount: Number(newRoutine.exercisesCount) || 5
        });
        setCreateModalOpen(false);
        setNewRoutine({ difficulty: 'Intermedio', exercisesCount: 0 });
    }
  };

  const handleAssign = (clientId: string) => {
    if (selectedRoutineId) {
        updateClient(clientId, { assignedRoutineId: selectedRoutineId });
        setAssignModalOpen(false);
        alert('Rutina asignada exitosamente');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Dumbbell className="text-blue-600" /> Entrenamiento Inteligente
            </h2>
            <p className="text-slate-500">Gestiona rutinas y asígnalas a tus clientes.</p>
        </div>
        <button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium shadow-sm">
            <Plus size={18} /> Nueva Rutina
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map((routine) => (
            <div key={routine.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider 
                            ${routine.difficulty === 'Principiante' ? 'bg-green-100 text-green-700' : 
                              routine.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'}`}>
                            {routine.difficulty}
                        </span>
                        <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                            <Activity size={20} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{routine.name}</h3>
                    <p className="text-slate-500 text-sm mb-4 h-10 overflow-hidden">{routine.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-100">
                        <span>{routine.exercisesCount} Ejercicios</span>
                        <button 
                            onClick={() => { setSelectedRoutineId(routine.id); setAssignModalOpen(true); }}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                            Asignar <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Assign Modal */}
      {assignModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Asignar Rutina</h3>
                    <button onClick={() => setAssignModalOpen(false)}><X size={20} className="text-slate-400"/></button>
                  </div>
                  <p className="text-slate-600 mb-4 text-sm">
                      Selecciona el cliente para asignarle: <span className="font-bold text-slate-900">{routines.find(r => r.id === selectedRoutineId)?.name}</span>
                  </p>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2 mb-6 border border-slate-100 rounded-lg divide-y divide-slate-100">
                      {clients.map(client => (
                          <button key={client.id} onClick={() => handleAssign(client.id)} className="w-full text-left p-3 hover:bg-slate-50 flex items-center justify-between group">
                              <div>
                                <p className="font-medium text-slate-800">{client.name}</p>
                                <p className="text-xs text-slate-500">{client.plan}</p>
                              </div>
                              <UserPlus size={18} className="text-slate-300 group-hover:text-blue-500" />
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Create Modal */}
      {createModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Crear Nueva Rutina</h3>
                    <button onClick={() => setCreateModalOpen(false)}><X size={20} className="text-slate-400"/></button>
                  </div>
                  <form onSubmit={handleCreateRoutine} className="space-y-4">
                      <div><label className="block text-sm font-medium text-slate-700">Nombre</label><input required type="text" className="w-full p-2 border rounded" value={newRoutine.name || ''} onChange={e => setNewRoutine({...newRoutine, name: e.target.value})} /></div>
                      <div><label className="block text-sm font-medium text-slate-700">Descripción</label><input required type="text" className="w-full p-2 border rounded" value={newRoutine.description || ''} onChange={e => setNewRoutine({...newRoutine, description: e.target.value})} /></div>
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-sm font-medium text-slate-700">Dificultad</label>
                          <select className="w-full p-2 border rounded" value={newRoutine.difficulty} onChange={e => setNewRoutine({...newRoutine, difficulty: e.target.value as any})}>
                              <option>Principiante</option><option>Intermedio</option><option>Avanzado</option>
                          </select></div>
                          <div><label className="block text-sm font-medium text-slate-700">Ejercicios</label><input type="number" className="w-full p-2 border rounded" value={newRoutine.exercisesCount} onChange={e => setNewRoutine({...newRoutine, exercisesCount: Number(e.target.value)})} /></div>
                      </div>
                      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Guardar</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
