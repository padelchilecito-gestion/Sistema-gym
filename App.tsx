import React, { useState } from 'react';
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
import { Client, Transaction, TransactionType, MembershipStatus, Product, CheckIn, GymSettings } from './types';

// Helpers for dates
const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

const currentYearMonth = (day: number) => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// Mock Data Initialization
const initialClients: Client[] = [
  { 
    id: '1', name: 'Juan Pérez', email: 'juan@example.com', phone: '5550101', joinDate: '2023-01-15', status: MembershipStatus.ACTIVE, balance: 0, plan: 'Premium',
    points: 1250, level: 'Gold', streak: 15, lastVisit: daysAgo(1), birthDate: '1990-05-12'
  },
  { 
    id: '2', name: 'María Garcia', email: 'maria@example.com', phone: '5550102', joinDate: '2023-03-10', status: MembershipStatus.ACTIVE, balance: 50, plan: 'Standard',
    points: 850, level: 'Silver', streak: 3, lastVisit: daysAgo(3), birthDate: currentYearMonth(15) 
  },
  { 
    id: '3', name: 'Carlos Rodriguez', email: 'carlos@example.com', phone: '5550103', joinDate: '2023-05-20', status: MembershipStatus.INACTIVE, balance: 0, plan: 'Básico',
    points: 120, level: 'Bronze', streak: 0, lastVisit: daysAgo(45), birthDate: '1985-11-30' 
  },
  { 
    id: '4', name: 'Ana López', email: 'ana@example.com', phone: '5550104', joinDate: '2023-06-01', status: MembershipStatus.ACTIVE, balance: 0, plan: 'Standard',
    points: 2100, level: 'Gold', streak: 45, lastVisit: daysAgo(20), birthDate: '1995-02-14' 
  },
  { 
    id: '5', name: 'Luis Fernández', email: 'luis@example.com', phone: '5550105', joinDate: '2023-02-14', status: MembershipStatus.ACTIVE, balance: 100, plan: 'Premium',
    points: 450, level: 'Bronze', streak: 1, lastVisit: daysAgo(0), birthDate: '1988-08-22'
  },
  { 
    id: '6', name: 'Sofía Vergara', email: 'sofia@example.com', phone: '5550106', joinDate: '2023-07-10', status: MembershipStatus.ACTIVE, balance: 0, plan: 'Premium',
    points: 980, level: 'Silver', streak: 8, lastVisit: daysAgo(2), birthDate: currentYearMonth(28) 
  },
];

const initialTransactions: Transaction[] = [
  { id: '101', description: 'Pago Mensualidad - Juan Pérez', amount: 50, date: '2023-10-01', type: TransactionType.INCOME, category: 'Mensualidad', clientId: '1' },
  { id: '102', description: 'Alquiler Local', amount: 1200, date: '2023-10-01', type: TransactionType.EXPENSE, category: 'Alquiler' },
  { id: '103', description: 'Venta Proteína', amount: 45, date: '2023-10-02', type: TransactionType.INCOME, category: 'Productos' },
  { id: '104', description: 'Reparación Caminadora', amount: 200, date: '2023-10-05', type: TransactionType.EXPENSE, category: 'Mantenimiento' },
  { id: '105', description: 'Pago Mensualidad - María Garcia', amount: 30, date: '2023-10-10', type: TransactionType.INCOME, category: 'Mensualidad', clientId: '2' },
  { id: '106', description: 'Pago Luz', amount: 150, date: '2023-10-15', type: TransactionType.EXPENSE, category: 'Servicios' },
  { id: '107', description: 'Venta Agua x10', amount: 20, date: '2023-10-16', type: TransactionType.INCOME, category: 'Productos' },
];

const initialProducts: Product[] = [
  { id: 'p1', name: 'Proteína Whey 1kg', price: 45.00, stock: 12, category: 'Suplementos', sku: 'PRO-001' },
  { id: 'p2', name: 'Agua Mineral 500ml', price: 1.50, stock: 45, category: 'Bebidas', sku: 'H2O-500' },
  { id: 'p3', name: 'Toalla GymFlow', price: 10.00, stock: 3, category: 'Accesorios', sku: 'TOW-001' },
];

const initialCheckIns: CheckIn[] = [
  { id: 'c1', clientId: '1', clientName: 'Juan Pérez', timestamp: new Date(new Date().getTime() - 45 * 60000).toISOString() }, 
  { id: 'c2', clientId: '5', clientName: 'Luis Fernández', timestamp: new Date(new Date().getTime() - 15 * 60000).toISOString() }, 
];

type View = 'dashboard' | 'clients' | 'accounting' | 'ai' | 'access' | 'inventory' | 'notifications' | 'gamification' | 'workouts' | 'marketing' | 'settings' | 'predictive';
type Role = 'admin' | 'client';

function App() {
  // Global State
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Feature State
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns);
  
  // Settings State (SaaS Plan)
  const [gymSettings, setGymSettings] = useState<GymSettings>({
    name: 'GymFlow Fitness',
    logoUrl: '',
    plan: 'Full' // Default to full for demo
  });

  const addClient = (client: Client) => {
    setClients([...clients, client]);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const handleCheckIn = (client: Client) => {
    const newCheckIn: CheckIn = {
      id: crypto.randomUUID(),
      clientId: client.id,
      clientName: client.name,
      timestamp: new Date().toISOString()
    };
    setCheckIns([newCheckIn, ...checkIns]);
  };

  // Plan Capabilities Check
  const hasFeature = (feature: 'basic' | 'standard' | 'full') => {
    if (gymSettings.plan === 'Full') return true;
    if (gymSettings.plan === 'Standard' && feature !== 'full') return true;
    if (gymSettings.plan === 'Basic' && feature === 'basic') return true;
    return false;
  };

  // Client Portal Mode
  if (currentRole === 'client') {
    return (
      <>
        {/* Role Switcher Overlay for Demo Purpose */}
        <div className="fixed top-4 right-4 z-50">
           <button 
              onClick={() => setCurrentRole('admin')}
              className="bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-slate-700"
           >
             <Monitor size={14} /> Cambiar a Admin (PC)
           </button>
        </div>
        <ClientPortal 
          client={clients[0]} 
          settings={gymSettings} 
          onLogout={() => setCurrentRole('admin')} 
        />
      </>
    );
  }

  // Admin Dashboard Mode
  const debtorsCount = clients.filter(c => c.balance > 0).length;

  const NavItem = ({ view, label, icon: Icon, badge, requiredPlan }: { view: View, label: string, icon: any, badge?: number, requiredPlan?: 'basic' | 'standard' | 'full' }) => {
    // Don't render if plan doesn't support it
    if (requiredPlan && !hasFeature(requiredPlan)) return null;

    return (
      <button
        onClick={() => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium relative
          ${currentView === view 
            ? 'bg-slate-900 text-white shadow-md' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
      >
        <Icon size={18} />
        <span className="text-sm">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Role Switcher for Demo */}
      <div className="fixed top-4 right-4 z-50 hidden lg:block">
           <button 
              onClick={() => setCurrentRole('client')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-indigo-500 transition-all transform hover:scale-105"
           >
             <Smartphone size={14} /> Ver App Cliente
           </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200 overflow-hidden">
              {gymSettings.logoUrl ? <img src={gymSettings.logoUrl} className="w-5 h-5 object-cover" alt="" /> : <Dumbbell size={20} strokeWidth={3} />}
            </div>
            <div>
               <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none truncate max-w-[140px]">{gymSettings.name}</h1>
               <span className="text-[10px] text-slate-400 uppercase font-bold">{gymSettings.plan} Plan</span>
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-2 custom-scrollbar">
            <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-1">Gestión</div>
            <NavItem view="dashboard" label="Dashboard" icon={LayoutDashboard} requiredPlan="basic" />
            <NavItem view="clients" label="Clientes" icon={Users} requiredPlan="basic" />
            <NavItem view="accounting" label="Contabilidad" icon={Calculator} requiredPlan="basic" />
            
            {/* Standard Features */}
            {hasFeature('standard') && (
              <>
                <NavItem view="access" label="Control Acceso" icon={ScanLine} requiredPlan="standard" />
              </>
            )}

            {/* Full Features */}
            {hasFeature('full') && (
              <>
                 <NavItem view="inventory" label="Inventario" icon={Package} requiredPlan="full" />
              </>
            )}
            
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
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-xs">
              AD
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-900">Admin</p>
              <p className="text-slate-500 text-xs">admin@gymflow.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 lg:hidden p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-slate-800">
              {gymSettings.name}
            </span>
          </div>
        </header>

        {/* View Render */}
        <div className="flex-1 overflow-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <Dashboard transactions={transactions} clients={clients} checkIns={checkIns} settings={gymSettings} />}
            {currentView === 'clients' && <Clients clients={clients} addClient={addClient} />}
            {currentView === 'accounting' && <Accounting transactions={transactions} addTransaction={addTransaction} clients={clients} />}
            {currentView === 'inventory' && <Inventory products={products} addProduct={addProduct} />}
            {currentView === 'access' && <AccessControl checkIns={checkIns} clients={clients} onCheckIn={handleCheckIn} />}
            {currentView === 'notifications' && <Notifications clients={clients} />}
            {currentView === 'gamification' && <Gamification clients={clients} />}
            {currentView === 'workouts' && <Workouts clients={clients} />}
            {currentView === 'marketing' && <MarketingCRM clients={clients} />}
            {currentView === 'ai' && <AIAssistant transactions={transactions} clients={clients} />}
            {currentView === 'settings' && <Settings settings={gymSettings} onUpdateSettings={setGymSettings} />}
            {currentView === 'predictive' && <PredictiveAnalytics transactions={transactions} checkIns={checkIns} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;