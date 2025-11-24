import React, { useState } from 'react';
import { Dumbbell, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { UserRole, Client, Staff } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, userData?: Client | Staff) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- ACCESO DE RESPALDO (BACKDOOR TEMPORAL) ---
    // Esto asegura que siempre puedas entrar aunque la base de datos esté vacía
    if (email === 'admin@gymflow.com' && password === 'admin123') {
      console.log("Usando acceso de respaldo Admin");
      onLogin('admin', { 
        id: 'admin-master', 
        name: 'Super Admin', 
        email: 'admin@gymflow.com', 
        role: 'admin' 
      });
      setLoading(false);
      return;
    }
    // ---------------------------------------------

    try {
      // 1. Buscar en colección STAFF (Admins e Instructores)
      const staffQuery = query(collection(db, 'staff'), where('email', '==', email));
      const staffSnapshot = await getDocs(staffQuery);

      if (!staffSnapshot.empty) {
        const staffDoc = staffSnapshot.docs[0];
        const staffData = staffDoc.data() as Staff;
        
        if (staffData.password === password) {
          onLogin(staffData.role, { ...staffData, id: staffDoc.id });
          return;
        } else {
           setError('Contraseña incorrecta (Staff).');
           setLoading(false);
           return;
        }
      }

      // 2. Si no es staff, buscar en CLIENTES
      const clientQuery = query(collection(db, 'clients'), where('email', '==', email));
      const clientSnapshot = await getDocs(clientQuery);

      if (!clientSnapshot.empty) {
        const clientDoc = clientSnapshot.docs[0];
        const clientData = clientDoc.data() as Client;
        // Si no tiene pass (legacy), usa '1234'
        const storedPass = clientData.password || '1234';

        if (password === storedPass) {
          onLogin('client', { ...clientData, id: clientDoc.id });
          return;
        } else {
           setError('Contraseña incorrecta (Cliente).');
           setLoading(false);
           return;
        }
      }

      // Si llegamos aquí, no se encontró el email en ninguna parte
      setError('Usuario no encontrado.');

    } catch (err) {
      console.error(err);
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8 text-center bg-indigo-600">
           <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
             <Dumbbell size={40} className="text-white" />
           </div>
           <h1 className="text-3xl font-bold text-white mb-1">GymFlow</h1>
           <p className="text-indigo-200 text-sm">Sistema de Gestión Integral</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Iniciar Sesión</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input required type="email" className="w-full pl-10 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@gymflow.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input required type="password" className="w-full pl-10 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <>Ingresar <ArrowRight size={20} /></>}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-xs">¿Problemas? Contacta al administrador.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
