import React, { useState } from 'react';
import { Routine, Client } from '../types';
import { Dumbbell, Plus, ChevronRight, UserPlus, Activity } from 'lucide-react';

interface WorkoutsProps {
  clients: Client[];
}

// Mock Routines
const initialRoutines: Routine[] = [
  { id: 'r1', name: 'Hipertrofia Total', difficulty: 'Avanzado', description: '5 días a la semana, enfoque en ganancia muscular.', exercisesCount: 24 },
  { id: 'r2', name: 'Pérdida de Peso Express', difficulty: 'Intermedio', description: 'Circuito HIIT de 30 minutos para quemar grasa.', exercisesCount: 8 },
  { id: 'r3', name: 'Iniciación GymFlow', difficulty: 'Principiante', description: 'Adaptación anatómica para nuevos miembros.', exercisesCount: 12 },
];

export const Workouts: React.FC<WorkoutsProps> = ({ clients }) => {
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines);
  const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const handleAssign = (clientId: string) => {
    // In a real app, this would update the client state via a prop function
    alert(`Rutina asignada al cliente ${clientId} exitosamente.`);
    setAssignModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Dumbbell className="text-blue-600" />
                Entrenamiento Inteligente
            </h2>
            <p className="text-slate-500">Gestiona rutinas y asígnalas a tus clientes.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium shadow-sm">
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
                            onClick={() => { setSelectedRoutine(routine.id); setAssignModalOpen(true); }}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Asignar Rutina</h3>
                  <p className="text-slate-600 mb-4 text-sm">
                      Selecciona el cliente para asignarle: <span className="font-bold text-slate-900">{routines.find(r => r.id === selectedRoutine)?.name}</span>
                  </p>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2 mb-6 border border-slate-100 rounded-lg divide-y divide-slate-100">
                      {clients.map(client => (
                          <button 
                            key={client.id}
                            onClick={() => handleAssign(client.id)}
                            className="w-full text-left p-3 hover:bg-slate-50 flex items-center justify-between group"
                          >
                              <div>
                                <p className="font-medium text-slate-800">{client.name}</p>
                                <p className="text-xs text-slate-500">{client.plan}</p>
                              </div>
                              <UserPlus size={18} className="text-slate-300 group-hover:text-blue-500" />
                          </button>
                      ))}
                  </div>

                  <div className="flex justify-end">
                      <button 
                        onClick={() => setAssignModalOpen(false)}
                        className="text-slate-500 font-medium px-4 py-2 hover:bg-slate-100 rounded-lg"
                      >
                          Cancelar
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};