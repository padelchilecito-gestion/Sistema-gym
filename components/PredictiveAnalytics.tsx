import React, { useEffect, useState } from 'react';
import { Transaction, CheckIn, BusinessPrediction } from '../types';
import { generateBusinessPrediction } from '../services/geminiService';
import { TrendingUp, Users, Lightbulb, Loader2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

interface PredictiveAnalyticsProps {
  transactions: Transaction[];
  checkIns: CheckIn[];
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ transactions, checkIns }) => {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<BusinessPrediction | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      // Simulate API Delay for effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = await generateBusinessPrediction(transactions, checkIns);
      setPrediction(data);
      setLoading(false);
    };

    fetchPrediction();
  }, [transactions, checkIns]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium">La IA está analizando tus datos...</p>
      </div>
    );
  }

  if (!prediction) {
    return <div className="p-6 text-center text-slate-500">No se pudieron generar predicciones. Intenta nuevamente.</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                <Lightbulb className="text-yellow-400" fill="currentColor" />
                IA Business Intelligence
            </h2>
            <p className="text-indigo-200 max-w-2xl">
                {prediction.summary}
            </p>
         </div>
         <BarChart3 className="absolute right-0 bottom-0 text-white opacity-5 w-64 h-64 transform translate-y-10 translate-x-10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Financial Prediction */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-600" /> Proyección Financiera (Próximo Mes)
            </h3>
            
            <div className="flex items-end gap-4 mb-6">
                <div>
                    <p className="text-slate-500 text-sm">Ingresos Estimados</p>
                    <p className="text-4xl font-bold text-slate-900">${prediction.predictedRevenue.toLocaleString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold mb-2 ${prediction.revenueTrendPercentage >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {prediction.revenueTrendPercentage >= 0 ? '+' : ''}{prediction.revenueTrendPercentage}% vs mes anterior
                </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Recomendación Estratégica</p>
                <p className="text-slate-700 italic">"{prediction.marketingStrategy}"</p>
            </div>
        </div>

        {/* Occupancy Heatmap */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Users className="text-blue-600" /> Mapa de Calor & Horas Muertas
            </h3>
            
            <div className="h-48 w-full mb-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prediction.hourlyHeatmap}>
                        <defs>
                            <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="hour" fontSize={10} tickLine={false} axisLine={false} interval={2} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                        <Area type="monotone" dataKey="occupancyScore" stroke="#8884d8" fillOpacity={1} fill="url(#colorOccupancy)" />
                    </AreaChart>
                 </ResponsiveContainer>
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Sugerencia de Happy Hours:</p>
                <div className="flex flex-wrap gap-2">
                    {prediction.suggestedHappyHours.map((hour, i) => (
                        <span key={i} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm font-bold border border-yellow-200">
                            {hour}
                        </span>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};