import React, { useState } from 'react';
import { GymSettings, SubscriptionPlan, Staff } from '../types';
import { Building2, Save, ShieldCheck, Star, Zap, Lock, Unlock, X, DollarSign, UserPlus, Trash2, Key } from 'lucide-react';

interface SettingsProps {
  settings: GymSettings;
  onUpdateSettings: (settings: GymSettings) => void;
  staffList: Staff[]; // NUEVO
  addStaff: (staff: Staff) => void; // NUEVO
  deleteStaff: (id: string) => void; // NUEVO
  updateStaffPassword: (id: string, newPass: string) => void; // NUEVO
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, staffList, addStaff, deleteStaff, updateStaffPassword }) => {
  const [formData, setFormData] = useState<GymSettings>(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'staff'>('general');
  
  // Estados para gestión de Staff
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'admin'|'instructor'>('instructor');

  const handleSave = () => {
    onUpdateSettings(formData);
    alert('Configuración guardada exitosamente');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if(newStaffEmail && newStaffPass) {
      addStaff({
        id: crypto.randomUUID(),
        name: newStaffName,
        email: newStaffEmail,
        password: newStaffPass,
        role: newStaffRole
      });
      setNewStaffName(''); setNewStaffEmail(''); setNewStaffPass('');
    }
  };

  const handlePriceChange = (key: 'basic' | 'intermediate' | 'full', value: string) => {
    setFormData({
      ...formData,
      membershipPrices: { ...formData.membershipPrices, [key]: parseFloat(value) || 0 }
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      
      {/* TABS */}
      <div className="flex space-x-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('general')} className={`pb-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'general' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500'}`}>
          General y Precios
        </button>
        <button onClick={() => setActiveTab('staff')} className={`pb-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'staff' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500'}`}>
          Gestión de Staff (Instructores)
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Config General (Mismo código anterior...) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Building2 size={20}/> Datos del Gimnasio</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label><input type="text" value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
            </div>
          </div>

          {/* Precios */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-emerald-50/50">
                <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-2"><DollarSign size={20}/> Precios de Cuotas</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {['basic', 'intermediate', 'full'].map((plan) => (
                  <div key={plan}>
                    <label className="block text-sm font-bold text-slate-700 mb-1 capitalize">{plan === 'intermediate' ? 'Intermedia' : plan === 'basic' ? 'Básica' : plan}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input type="number" value={formData.membershipPrices?.[plan as keyof typeof formData.membershipPrices] || 0} 
                            onChange={(e) => handlePriceChange(plan as any, e.target.value)}
                            className="w-full pl-8 p-2 border border-slate-300 rounded-lg font-bold" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="flex justify-end">
              <button onClick={handleSave} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 flex items-center gap-2"><Save size={18}/> Guardar Cambios</button>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="space-y-6 animate-in fade-in">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck size={20}/> Equipo de Trabajo</h2>
              </div>
              
              {/* Formulario Nuevo Staff */}
              <div className="p-6 bg-slate-50 border-b border-slate-200">
                 <h3 className="text-sm font-bold text-slate-700 mb-3">Agregar Nuevo Usuario</h3>
                 <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-1"><input required placeholder="Nombre" className="w-full p-2 border rounded-lg text-sm" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} /></div>
                    <div className="md:col-span-1"><input required type="email" placeholder="Email" className="w-full p-2 border rounded-lg text-sm" value={newStaffEmail} onChange={e => setNewStaffEmail(e.target.value)} /></div>
                    <div className="md:col-span-1"><input required type="text" placeholder="Contraseña" className="w-full p-2 border rounded-lg text-sm" value={newStaffPass} onChange={e => setNewStaffPass(e.target.value)} /></div>
                    <div className="md:col-span-1">
                      <select className="w-full p-2 border rounded-lg text-sm" value={newStaffRole} onChange={e => setNewStaffRole(e.target.value as any)}>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="md:col-span-1">
                      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-1"><UserPlus size={16}/> Agregar</button>
                    </div>
                 </form>
              </div>

              {/* Lista de Staff */}
              <div className="p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-slate-600">Nombre</th>
                      <th className="px-6 py-3 text-slate-600">Email</th>
                      <th className="px-6 py-3 text-slate-600">Rol</th>
                      <th className="px-6 py-3 text-slate-600">Clave</th>
                      <th className="px-6 py-3 text-right text-slate-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffList.map(staff => (
                      <tr key={staff.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 font-medium">{staff.name}</td>
                        <td className="px-6 py-3 text-slate-500">{staff.email}</td>
                        <td className="px-6 py-3"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${staff.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{staff.role}</span></td>
                        <td className="px-6 py-3 font-mono text-xs text-slate-400">•••••</td>
                        <td className="px-6 py-3 text-right flex justify-end gap-2">
                           <button onClick={() => {
                             const newPass = prompt('Ingresa la nueva contraseña para ' + staff.name);
                             if(newPass) updateStaffPassword(staff.id, newPass);
                           }} className="p-1 text-slate-400 hover:text-blue-600" title="Cambiar Clave"><Key size={16}/></button>
                           <button onClick={() => deleteStaff(staff.id)} className="p-1 text-slate-400 hover:text-red-600" title="Eliminar"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
