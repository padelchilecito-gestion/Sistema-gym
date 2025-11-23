import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calculator, Bot, Menu, Dumbbell, ScanLine, Package, Bell, Trophy, HeartPulse, Activity, Lightbulb, Settings as SettingsIcon, Monitor, Smartphone } from 'lucide-react';
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
import { Client, Transaction, Product, CheckIn, GymSettings, MembershipStatus, TransactionType } from './types';

import { db } from './firebase';
import { collection, setDoc, doc, onSnapshot, query, orderBy, deleteDoc, updateDoc } from 'firebase/firestore';

type View = 'dashboard' | 'clients' | 'accounting' | 'ai' | 'access' | 'inventory' | 'notifications' | 'gamification' | 'workouts' | 'marketing' | 'settings' | 'predictive';
type Role = 'admin' | 'client';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  
  const [gymSettings, setGymSettings] = useState<GymSettings>({
    name: 'GymFlow Fitness',
    logoUrl: '',
    plan: 'Full',
    membershipPrices: { basic: 0, intermediate: 0, full: 0 } // Valores por defecto
  });

  // --- Sincronización Firebase ---
  useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClients(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Client)));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Transaction)));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product)));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'checkins'), orderBy('timestamp', 'desc')); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCheckIns(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CheckIn)));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'config'), (doc) => {
      if (doc.exists()) {
        // Forzamos el tipo para asegurar que membershipPrices exista
        const data = doc.data() as GymSettings;
        setGymSettings({
          ...data,
          membershipPrices: data.membershipPrices || { basic: 0, intermediate: 0, full: 0 }
        });
      }
    });
    return () => unsubscribe();
  }, []);


  // --- Helper para obtener precio ---
  const getPlanPrice = (planCode: string) => {
    // Mapeo seguro usando los precios configurados
    const prices: any = gymSettings.membershipPrices || { basic: 0, intermediate: 0, full: 0 };
    return prices[planCode] || 0;
  };


  // --- Funciones de Acción ---

  const addClient = async (client: Client) => {
    // 1. Buscamos el precio configurado en Settings
    const planPrice = getPlanPrice(client.plan);
    
    // 2. Descontamos el plan del saldo inicial
    const initialBalance = client.balance; 
    const finalBalance = initialBalance - planPrice;

    // 3. Preparamos cliente
    const clientWithPayment = {
      ...client,
      balance: finalBalance, 
      lastMembershipPayment: new Date().toISOString().split('T')[0] // Marcamos hoy como pagado
    };
    
    await setDoc(doc(db, 'clients', client.id), clientWithPayment);

    // 4. Si el plan tiene costo, registramos el ingreso en Contabilidad
    if (planPrice > 0) {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        clientId: client.id,
        description: `Pago Inicial - Alta Cliente (Plan ${client.plan})`,
        amount: planPrice,
        date: new Date().toISOString().split('T')[0],
        type: TransactionType.INCOME,
        category: 'Cuota'
      };
      await setDoc(doc(db, 'transactions', newTransaction.id), newTransaction);
    }
  };

  const updateClient = async (clientId: string, data: Partial<Client>) => {
    await updateDoc(doc(db, 'clients', clientId), data);
  };

  const deleteClient = async (clientId: string) => {
    if(window.confirm('¿Estás seguro de borrar este cliente? Esta acción no se puede deshacer.')) {
      await deleteDoc(doc(db, 'clients', clientId));
    }
  };

  const registerPayment = async (client: Client, amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      clientId: client.id,
      description: description,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      type: TransactionType.INCOME,
      category: 'Cuota'
    };
    await setDoc(doc(db, 'transactions', newTransaction.id), newTransaction);

    const newBalance = client.balance + amount;
    await updateDoc(doc(db, 'clients', client.id), { balance: newBalance });
  };

  const addTransaction = async (transaction: Transaction) => {
    await setDoc(doc(db, 'transactions', transaction.id), transaction);
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    await updateDoc(doc(db, 'transactions', id), data);
  };

  const deleteTransaction = async (id: string) => {
    if(window.confirm('¿Borrar este movimiento contable?')) {
      await deleteDoc(doc(db, 'transactions', id));
    }
  };

  const addProduct = async (product: Product) => {
    await setDoc(doc(db, 'products', product.id), product);
  };

  const handleCheckIn = async (client: Client) => {
    const newCheckIn: CheckIn = {
      id: crypto.randomUUID(),
      clientId: client.id,
      clientName: client.name,
      timestamp: new Date().toISOString()
    };
    await setDoc(doc(db, 'checkins', newCheckIn.id), newCheckIn);
  };

  const handleUpdateSettings = async (settings: GymSettings) => {
    await setDoc(doc(db, 'settings', 'config'), settings);
    setGymSettings(settings); 
  };

  const hasFeature = (feature: 'basic' | 'standard' | 'full') => {
    if (gymSettings.plan === 'Full') return true;
    if (gymSettings.plan === 'Standard' && feature !== 'full') return true;
    if (gymSettings.plan === 'Basic' && feature === 'basic') return true;
    return false;
  };

  if (currentRole === 'client') {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
           <button onClick={() => setCurrentRole('admin')} className="bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-slate-700">
             <Monitor size={14} /> Cambiar a Admin (PC)
           </button>
        </div>
        <ClientPortal client={clients[0] || { id: 'demo', name: 'Usuario Demo', email: 'demo@gym.com', phone: '', joinDate: '', status: MembershipStatus.ACTIVE, balance: 0, plan: 'Básico', points: 0, level: 'Bronze', streak: 0, lastVisit: '', birthDate: '' }} settings={gymSettings} onLogout={() => setCurrentRole('admin')} />
      </>
    );
  }

  const debtorsCount = clients.filter(c => c.balance < 0).length;

  const NavItem = ({ view, label, icon: Icon, badge, requiredPlan }: { view: View, label: string, icon: any, badge?: number, requiredPlan?: 'basic' | 'standard' | 'full' }) => {
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
      <div className="fixed top-4 right-4 z-50 hidden lg:block">
           <button onClick={() => setCurrentRole('client')} className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-indigo-500 transition-all transform hover:scale-105">
             <Smartphone size={14} /> Ver App Cliente
           </button>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200 overflow-hidden">
              {gymSettings.logoUrl ? <img src={gymSettings.logoUrl} className="w-5 h-5 object-cover" alt="" /> : <Dumbbell size={20} strokeWidth={3} />}
            </div>
            <div><h1 className="text-base font-bold text-slate-900 tracking-tight leading-none truncate max-w-[140px]">{gymSettings.name}</h1><span className="text-[10px] text-slate-400 uppercase font-bold">{gymSettings.plan} Plan</span></div>
          </div>
          <nav className="space-y-1 flex-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-2 custom-scrollbar">
            <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-1">Gestión</div>
            <NavItem view="dashboard" label="Dashboard" icon={LayoutDashboard} requiredPlan="basic" />
            <NavItem view="clients" label="Clientes" icon={Users} requiredPlan="basic" />
            <NavItem view="accounting" label="Contabilidad" icon={Calculator} requiredPlan="basic" />
            {hasFeature('standard') && <NavItem view="access" label="Control Acceso" icon={ScanLine} requiredPlan="standard" />}
            {hasFeature('full') && <NavItem view="inventory" label="Inventario" icon={Package} requiredPlan="full" />}
            {hasFeature('full') && (
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Fidelización</div>
                <NavItem view="gamification" label="Gamificación" icon={Trophy} requiredPlan="full" />
                <NavItem view="workouts" label="Entrenamientos" icon={Activity} requiredPlan="full" />
              </div>
            )}
            <div className="pt-4 mt-4 border-t border-slate-100">
               <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Marketing</div>
               <NavItem view="notifications" label="Cobranzas" icon={Bell} badge={debtorsCount} requiredPlan="basic" />
               <NavItem view="marketing" label="CRM & Rescate" icon={HeartPulse} requiredPlan="standard" />
            </div>
            {hasFeature('full') && (
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Inteligencia</div>
                <NavItem view="ai" label="Asistente AI" icon={Bot} requiredPlan="full" />
                <NavItem view="predictive" label="IA Predictiva" icon={Lightbulb} requiredPlan="full" />
              </div>
            )}
            <div className="pt-4 mt-4 border-t border-slate-100">
               <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sistema</div>
               <NavItem view="settings" label="Configuración" icon={SettingsIcon} />
            </div>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-xs">AD</div>
             <div className="text-sm"><p className="font-medium text-slate-900">Admin</p><p className="text-slate-500 text-xs">admin@gymflow.com</p></div>
          </div>
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
             {currentView === 'access' && <AccessControl checkIns={checkIns} clients={clients} onCheckIn={handleCheckIn} />}
             {currentView === 'notifications' && <Notifications clients={clients} />}
             {currentView === 'gamification' && <Gamification clients={clients} />}
             {currentView === 'workouts' && <Workouts clients={clients} />}
             {currentView === 'marketing' && <MarketingCRM clients={clients} />}
             {currentView === 'ai' && <AIAssistant transactions={transactions} clients={clients} />}
             {currentView === 'settings' && <Settings settings={gymSettings} onUpdateSettings={handleUpdateSettings} />}
             {currentView === 'predictive' && <PredictiveAnalytics transactions={transactions} checkIns={checkIns} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
