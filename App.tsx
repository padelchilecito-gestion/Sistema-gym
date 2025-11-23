import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calculator, Bot, Menu, Dumbbell, ScanLine, Package, Bell, Trophy, HeartPulse, Activity, Lightbulb, Settings as SettingsIcon, Monitor, Smartphone, LogOut } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Accounting } from './components/Accounting';
import { AIAssistant } from './components/AIAssistant';
import { AccessControl } from './components/AccessControl';
import { Inventory } from './components/Inventory';
import { Notifications } from './components/Notifications';
import { Gamification } from './components/Gamification';
import { Workouts } from './components/Workouts';
import { MarketingCRM } from './components/MarketingCRM';
import { Settings } from './components/Settings';
import { ClientPortal } from './components/ClientPortal';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { Login } from './components/Login';
import { Client, Transaction, Product, CheckIn, GymSettings, MembershipStatus, TransactionType, Routine, UserRole, Staff } from './types';

import { db } from './firebase';
import { collection, setDoc, doc, onSnapshot, query, orderBy, deleteDoc, updateDoc } from 'firebase/firestore';

type View = 'dashboard' | 'clients' | 'accounting' | 'ai' | 'access' | 'inventory' | 'notifications' | 'gamification' | 'workouts' | 'marketing' | 'settings' | 'predictive';

function App() {
  // ESTADO DE SESIÓN
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<Client | undefined>(undefined);

  // ESTADO DE LA APP
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // DATOS
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]); 
  const [staffList, setStaffList] = useState<Staff[]>([]);
  
  const [gymSettings, setGymSettings] = useState<GymSettings>({
    name: 'GymFlow Fitness',
    logoUrl: '',
    plan: 'Full',
    membershipPrices: { basic: 0, intermediate: 0, full: 0 }
  });

  // --- Sincronización Firebase ---
  useEffect(() => {
    if (!userRole) return;

    const qClients = query(collection(db, 'clients'), orderBy('name'));
    const unsubClients = onSnapshot(qClients, (s) => setClients(s.docs.map(d => ({ ...d.data(), id: d.id } as Client))));

    const qTrans = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsubTrans = onSnapshot(qTrans, (s) => setTransactions(s.docs.map(d => ({ ...d.data(), id: d.id } as Transaction))));

    const qProds = query(collection(db, 'products'), orderBy('name'));
    const unsubProds = onSnapshot(qProds, (s) => setProducts(s.docs.map(d => ({ ...d.data(), id: d.id } as Product))));

    const qCheck = query(collection(db, 'checkins'), orderBy('timestamp', 'desc')); 
    const unsubCheck = onSnapshot(qCheck, (s) => setCheckIns(s.docs.map(d => ({ ...d.data(), id: d.id } as CheckIn))));

    const qRout = query(collection(db, 'routines'));
    const unsubRout = onSnapshot(qRout, (s) => setRoutines(s.docs.map(d => ({ ...d.data(), id: d.id } as Routine))));

    const qStaff = query(collection(db, 'staff'));
    const unsubStaff = onSnapshot(qStaff, (s) => setStaffList(s.docs.map(d => ({ ...d.data(), id: d.id } as Staff))));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'config'), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as GymSettings;
        setGymSettings({ ...data, membershipPrices: data.membershipPrices || { basic: 0, intermediate: 0, full: 0 } });
      }
    });

    return () => {
      unsubClients(); unsubTrans(); unsubProds(); unsubCheck(); unsubRout(); unsubStaff(); unsubSettings();
    };
  }, [userRole]);

  const getPlanPrice = (planCode: string) => {
    const prices: any = gymSettings.membershipPrices || { basic: 0, intermediate: 0, full: 0 };
    return prices[planCode] || 0;
  };

  // --- Funciones de Acción ---
  const addClient = async (client: Client) => {
    const planPrice = getPlanPrice(client.plan);
    const initialBalance = client.balance; 
    const finalBalance = initialBalance - planPrice;
    const clientWithPayment = { ...client, balance: finalBalance, lastMembershipPayment: new Date().toISOString().split('T')[0] };
    await setDoc(doc(db, 'clients', client.id), clientWithPayment);
    if (planPrice > 0) {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(), clientId: client.id, description: `Pago Inicial - Alta Cliente (Plan ${client.plan})`, amount: planPrice, date: new Date().toISOString().split('T')[0], type: TransactionType.INCOME, category: 'Cuota'
      };
      await setDoc(doc(db, 'transactions', newTransaction.id), newTransaction);
    }
  };

  const updateClient = async (clientId: string, data: Partial<Client>) => await updateDoc(doc(db, 'clients', clientId), data);
  const deleteClient = async (clientId: string) => { if(window.confirm('¿Seguro?')) await deleteDoc(doc(db, 'clients', clientId)); };
  const registerPayment = async (client: Client, amount: number, description: string) => {
    const newTransaction: Transaction = { id: crypto.randomUUID(), clientId: client.id, description: description, amount: amount, date: new Date().toISOString().split('T')[0], type: TransactionType.INCOME, category: 'Cuota' };
    await setDoc(doc(db, 'transactions', newTransaction.id), newTransaction);
    const newBalance = client.balance + amount;
    await updateDoc(doc(db, 'clients', client.id), { balance: newBalance });
  };
  const addTransaction = async (t: Transaction) => await setDoc(doc(db, 'transactions', t.id), t);
  const updateTransaction = async (id: string, data: Partial<Transaction>) => await updateDoc(doc(db, 'transactions', id), data);
  const deleteTransaction = async (id: string) => { if(window.confirm('¿Seguro?')) await deleteDoc(doc(db, 'transactions', id)); };
  const addProduct = async (p: Product) => await setDoc(doc(db, 'products', p.id), p);
  const handleCheckIn = async (client: Client) => {
    const newCheckIn: CheckIn = { id: crypto.randomUUID(), clientId: client.id, clientName: client.name, timestamp: new Date().toISOString(), checkoutTimestamp: null };
    await setDoc(doc(db, 'checkins', newCheckIn.id), newCheckIn);
  };
  const handleCheckOut = async (checkInId: string) => await updateDoc(doc(db, 'checkins', checkInId), { checkoutTimestamp: new Date().toISOString() });
  const addRoutine = async (r: Routine) => await setDoc(doc(db, 'routines', r.id), r);
  const handleUpdateSettings = async (s: GymSettings) => { await setDoc(doc(db, 'settings', 'config'), s); setGymSettings(s); };
  
  // Staff actions
  const addStaff = async (staff: Staff) => await setDoc(doc(db, 'staff', staff.id), staff);
  const deleteStaff = async (id: string) => { if(window.confirm('¿Borrar usuario?')) await deleteDoc(doc(db, 'staff', id)); };
  const updateStaffPassword = async (id: string, newPass: string) => await updateDoc(doc(db, 'staff', id), { password: newPass });

  // --- CONTROL DE ACCESO POR ROL ---
  const hasAccess = (view: View) => {
    if (userRole === 'admin') return true;
    if (userRole === 'instructor') {
      return ['dashboard', 'clients', 'access', 'workouts'].includes(view);
    }
    return false; 
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(undefined);
    setCurrentView('dashboard');
  };

  const hasFeature = (feature: 'basic' | 'standard' | 'full') => {
    if (gymSettings.plan === 'Full') return true;
    if (gymSettings.plan === 'Standard' && feature !== 'full') return true;
    if (gymSettings.plan === 'Basic' && feature === 'basic') return true;
    return false;
  };

  // --- RENDERIZADO ---

  if (!userRole) {
    return <Login onLogin={(role, data) => {
      setUserRole(role);
      // Si es cliente, data es Client; si es staff, es Staff.
      // Para el portal de cliente necesitamos que sea tipo Client.
      if (role === 'client' && data) {
         // Aseguramos que data tenga las propiedades de Client
         setCurrentUser(data as Client);
      }
    }} />;
  }

  if (userRole === 'client' && currentUser) {
    return (
      <ClientPortal 
        client={currentUser} 
        settings={gymSettings} 
        checkIns={checkIns} 
        routines={routines} 
        onLogout={handleLogout} 
      />
    );
  }

  const debtorsCount = clients.filter(c => c.balance < 0).length;

  const NavItem = ({ view, label, icon: Icon, badge, requiredPlan }: { view: View, label: string, icon: any, badge?: number, requiredPlan?: 'basic' | 'standard' | 'full' }) => {
    if (!hasAccess(view)) return null; 
    if (requiredPlan && !hasFeature(requiredPlan)) return null;
    return (
      <button onClick={() => { setCurrentView(view); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium relative ${currentView === view ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
        <Icon size={18} /> <span className="text-sm">{label}</span>
        {badge !== undefined && badge > 0 && <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200 overflow-hidden">
              {gymSettings.logoUrl ? <img src={gymSettings.logoUrl} className="w-5 h-5 object-cover" alt="" /> : <Dumbbell size={20} strokeWidth={3} />}
            </div>
            <div><h1 className="text-base font-bold text-slate-900 tracking-tight leading-none truncate max-w-[140px]">{gymSettings.name}</h1><span className="text-[10px] text-slate-400 uppercase font-bold">{userRole === 'admin' ? 'Administrador' : 'Instructor'}</span></div>
          </div>
          <nav className="space-y-1 flex-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-2 custom-scrollbar">
            <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-1">Gestión</div>
            <NavItem view="dashboard" label="Dashboard" icon={LayoutDashboard} requiredPlan="basic" />
            <NavItem view="clients" label="Clientes" icon={Users} requiredPlan="basic" />
            <NavItem view="accounting" label="Contabilidad" icon={Calculator} requiredPlan="basic" />
            <NavItem view="access" label="Control Acceso" icon={ScanLine} requiredPlan="standard" />
            <NavItem view="inventory" label="Inventario" icon={Package} requiredPlan="full" />
            
            <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Fidelización</div>
                <NavItem view="gamification" label="Gamificación" icon={Trophy} requiredPlan="full" />
                <NavItem view="workouts" label="Entrenamientos" icon={Activity} requiredPlan="full" />
            </div>
            
            <div className="pt-4 mt-4 border-t border-slate-100">
               <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Marketing</div>
               <NavItem view="notifications" label="Cobranzas" icon={Bell} badge={debtorsCount} requiredPlan="basic" />
               <NavItem view="marketing" label="CRM & Rescate" icon={HeartPulse} requiredPlan="standard" />
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
               <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sistema</div>
               <NavItem view="ai" label="Asistente AI" icon={Bot} requiredPlan="full" />
               <NavItem view="predictive" label="IA Predictiva" icon={Lightbulb} requiredPlan="full" />
               <NavItem view="settings" label="Configuración" icon={SettingsIcon} />
            </div>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-2 w-full text-left hover:bg-slate-50 p-2 rounded-lg transition-colors">
             <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-xs">
               {userRole === 'admin' ? 'AD' : 'IN'}
             </div>
             <div className="text-sm flex-1">
               <p className="font-medium text-slate-900 capitalize">{userRole}</p>
               <p className="text-slate-500 text-xs">Cerrar Sesión</p>
             </div>
             <LogOut size={16} className="text-slate-400" />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 lg:hidden p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><Menu size={24} /></button>
            <span className="font-bold text-lg text-slate-800">{gymSettings.name}</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
             {currentView === 'dashboard' && <Dashboard transactions={transactions} clients={clients} checkIns={checkIns} settings={gymSettings} />}
             {currentView === 'clients' && <Clients clients={clients} addClient={addClient} updateClient={updateClient} deleteClient={deleteClient} registerPayment={registerPayment} />}
             {currentView === 'accounting' && <Accounting transactions={transactions} addTransaction={addTransaction} updateTransaction={updateTransaction} deleteTransaction={deleteTransaction} clients={clients} />}
             {currentView === 'inventory' && <Inventory products={products} addProduct={addProduct} />}
             {currentView === 'access' && <AccessControl checkIns={checkIns} clients={clients} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />}
             {currentView === 'notifications' && <Notifications clients={clients} />}
             {currentView === 'gamification' && <Gamification clients={clients} />}
             {currentView === 'workouts' && <Workouts clients={clients} routines={routines} addRoutine={addRoutine} updateClient={updateClient} />}
             {currentView === 'marketing' && <MarketingCRM clients={clients} />}
             {currentView === 'ai' && <AIAssistant transactions={transactions} clients={clients} />}
             {currentView === 'settings' && <Settings settings={gymSettings} onUpdateSettings={handleUpdateSettings} staffList={staffList} addStaff={addStaff} deleteStaff={deleteStaff} updateStaffPassword={updateStaffPassword} />}
             {currentView === 'predictive' && <PredictiveAnalytics transactions={transactions} checkIns={checkIns} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
