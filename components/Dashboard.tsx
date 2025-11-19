import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Transaction, TransactionType, Client, MembershipStatus, CheckIn, GymSettings } from '../types';
import { Users, DollarSign, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  clients: Client[];
  checkIns: CheckIn[];
  settings: GymSettings;
}

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions, clients, checkIns, settings }) => {
  
  // Calculate High Level Stats
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netIncome = totalIncome - totalExpense;
  const activeMembers = clients.filter(c => c.status === MembershipStatus.ACTIVE).length;

  // Calculate Accounts Receivable (Debt)
  const totalReceivable = clients.filter(c => c.balance > 0).reduce((acc, curr) => acc + curr.balance, 0);


  // Calculate current occupancy (last 2 hours)
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const currentOccupancy = checkIns ? checkIns.filter(c => new Date(c.timestamp) > twoHoursAgo).length : 0;


  // Chart Data Preparation
  const monthlyDataMap = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('es-ES', { month: 'short' });
    if (!acc[month]) acc[month] = { name: month, Ingreso: 0, Gasto: 0 };
    if (t.type === TransactionType.INCOME) acc[month].Ingreso += t.amount;
    else acc[month].Gasto += t.amount;
    return acc;
  }, {} as Record<string, any>);

  const barChartData = Object.values(monthlyDataMap);

  const statusData = [
    { name: 'Activos', value: activeMembers },
    { name: 'Inactivos', value: clients.filter(c => c.status === MembershipStatus.INACTIVE).length },
    { name: 'Pendientes', value: clients.filter(c => c.status === MembershipStatus.PENDING).length },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      
      {/* Welcome Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido a {settings.name}</h1>
        <p className="text-slate-500">Resumen ejecutivo de tu gimnasio.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Ingresos Totales</p>
              <p className="text-2xl font-bold text-emerald-600">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Gastos Totales</p>
              <p className="text-2xl font-bold text-red-600">${totalExpense.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Balance Neto</p>
              <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${netIncome.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Cuentas por Cobrar</p>
              <p className="text-2xl font-bold text-orange-600">${totalReceivable.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Miembros Activos</p>
              <p className="text-2xl font-bold text-slate-800">{activeMembers}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
              <Users size={24} />
            </div>
          </div>
        </div>

         <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Ocupación Actual</p>
              <p className="text-2xl font-bold text-white">{currentOccupancy} <span className="text-xs font-normal text-slate-400">personas</span></p>
            </div>
            <div className="p-3 bg-slate-800 rounded-full text-indigo-400">
              <Activity size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Flujo de Caja</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend />
              <Bar dataKey="Ingreso" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gasto" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribución de Miembros</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};