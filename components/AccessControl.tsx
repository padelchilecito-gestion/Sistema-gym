import React, { useState, useEffect } from 'react';
import { CheckIn, Client, MembershipStatus } from '../types';
import { Clock, Users, CheckCircle, AlertCircle, QrCode, Smartphone } from 'lucide-react';

interface AccessControlProps {
  checkIns: CheckIn[];
  clients: Client[];
  onCheckIn: (client: Client) => void;
}

export const AccessControl: React.FC<AccessControlProps> = ({ checkIns, clients, onCheckIn }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [dynamicQrCode, setDynamicQrCode] = useState('');
  
  // Calculate occupancy: People who checked in within the last 2 hours
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const currentOccupancy = checkIns.filter(c => new Date(c.timestamp) > twoHoursAgo).length;

  // Dynamic QR Logic Simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isQrModalOpen) {
      // Regenerate code every 3 seconds to simulate TOTP/Dynamic QR
      const generateCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();
      setDynamicQrCode(generateCode());
      interval = setInterval(() => {
        setDynamicQrCode(generateCode());
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isQrModalOpen]);

  const handleCheckIn = () => {
    const client = clients.find(c => c.id === selectedClientId);
    if (client) {
      onCheckIn(client);
      setSelectedClientId('');
    }
  };

  const sortedCheckIns = [...checkIns].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const selectedClientDetails = clients.find(c => c.id === selectedClientId);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Check-In Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle className="text-emerald-500" size={20} />
                Control de Acceso
                </h2>
                <button 
                    onClick={() => setIsQrModalOpen(true)}
                    className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
                >
                    <Smartphone size={16} /> Simulador App Cliente
                </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">Seleccionar Cliente (Entrada Manual)</label>
                <select
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                >
                  <option value="">Buscar cliente...</option>
                  {clients.filter(c => c.status === MembershipStatus.ACTIVE).map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.plan}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCheckIn}
                disabled={!selectedClientId}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Marcar Ingreso
              </button>
            </div>

            {/* Quick Status Preview */}
            {selectedClientDetails && (
              <div className={`mt-4 p-4 rounded-lg border ${selectedClientDetails.balance > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-start gap-3">
                   {selectedClientDetails.balance > 0 ? <AlertCircle className="text-red-500" /> : <CheckCircle className="text-emerald-500" />}
                   <div>
                     <p className={`font-bold ${selectedClientDetails.balance > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                       {selectedClientDetails.balance > 0 ? 'Cliente con Deuda' : 'Cliente al Día'}
                     </p>
                     <p className="text-sm text-slate-600 mt-1">
                       Saldo actual: ${selectedClientDetails.balance}. Plan: {selectedClientDetails.plan}.
                     </p>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* History List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 font-semibold text-slate-700">
              Últimos Accesos (Hoy)
            </div>
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {sortedCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{checkIn.clientName}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(checkIn.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-xs font-mono">
                    <Clock size={14} />
                    {new Date(checkIn.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))}
              {sortedCheckIns.length === 0 && (
                <div className="p-8 text-center text-slate-500">No hay registros de entrada hoy.</div>
              )}
            </div>
          </div>
        </div>

        {/* Live Status Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-slate-300 font-medium mb-1">Ocupación Actual</h3>
              <div className="text-5xl font-bold mb-2">{currentOccupancy}</div>
              <p className="text-slate-400 text-sm">Personas entrenando ahora</p>
            </div>
            <Users className="absolute right-[-20px] bottom-[-20px] text-slate-800 opacity-50" size={140} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Horas Pico</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">07:00 - 09:00</span>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 w-[80%]"></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">17:00 - 19:00</span>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[95%]"></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">20:00 - 22:00</span>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 w-[60%]"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 italic">Basado en datos históricos</p>
          </div>
        </div>
      </div>

      {/* QR Modal Simulator */}
      {isQrModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl relative text-center">
                  <button onClick={() => setIsQrModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
                  
                  <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Tu Pase de Acceso</h3>
                      <p className="text-slate-500 text-sm">Escanea en el torniquete</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border-2 border-slate-900 inline-block mb-6 shadow-inner">
                     <QrCode size={180} className="text-slate-900" />
                  </div>

                  <div className="mb-6">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Token Seguro</p>
                      <div className="text-3xl font-mono font-bold text-blue-600 tracking-widest animate-pulse">
                          {dynamicQrCode}
                      </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
                      <Clock size={12} />
                      Este código cambia cada 30 segundos para tu seguridad.
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};