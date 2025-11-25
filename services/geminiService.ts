import { GoogleGenAI } from "@google/genai";
import { Transaction, Client, CheckIn, BusinessPrediction } from "../types";

// CORRECCIÓN: Usamos el estándar de Vite (import.meta.env)
// Asegúrate de que en Vercel la variable se llame: VITE_GEMINI_API_KEY
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

const ai = new GoogleGenAI({ apiKey });

export const analyzeFinancialData = async (
  transactions: Transaction[],
  clients: Client[],
  query: string
): Promise<string> => {
  
  if (!apiKey) return "Error: API Key no configurada. Revisa tus variables de entorno.";

  const financialSummary = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'Activo').length, 
    clientsWithDebt: clients.filter(c => c.balance < 0).map(c => ({ name: c.name, debt: c.balance })),
    recentTransactions: transactions.slice(0, 50), 
  };

  const systemPrompt = `
    Eres un experto contador y analista financiero para un gimnasio llamado "GymFlow".
    Tu trabajo es responder preguntas del administrador basándote estrictamente en los datos proporcionados.
    
    Reglas:
    1. Sé conciso y profesional.
    2. Si te preguntan por deudores, lístalos.
    3. Si te piden proyecciones, basa tu respuesta en los ingresos recientes.
    4. Responde siempre en Español.
    5. Usa formato Markdown para listas o negritas.

    Datos actuales del negocio (JSON):
    ${JSON.stringify(financialSummary, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: query,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return response.text() || "No pude generar un análisis en este momento.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Lo siento, hubo un error al conectar con el asistente financiero. Verifica tu conexión o clave API.";
  }
};

export const generateBusinessPrediction = async (
  transactions: Transaction[],
  checkIns: CheckIn[]
): Promise<BusinessPrediction | null> => {
  
  if (!apiKey) {
      console.error("API Key missing");
      return null;
  }

  const currentMonthRevenue = transactions
    .filter(t => t.type === 'Ingreso' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0);

  const checkinHours = checkIns.map(c => new Date(c.timestamp).getHours());
  
  const dataContext = {
    currentMonthRevenue,
    transactionCount: transactions.length,
    totalCheckIns: checkIns.length,
    checkinDistribution: checkinHours
  };

  const systemPrompt = `
    Actúa como un consultor de negocios de gimnasios experto en datos.
    Analiza los siguientes datos y devuelve una predicción estratégica en formato JSON.
    
    Debes predecir:
    1. Ingresos del próximo mes (predictedRevenue).
    2. Tendencia porcentual (revenueTrendPercentage).
    3. Una estrategia de marketing corta y agresiva.
    4. Detectar "Horas Muertas" (baja afluencia) y sugerir Happy Hours.
    5. Generar un mapa de calor de 6am a 22pm (hourlyHeatmap) donde 'occupancyScore' es 0-100.

    Datos: ${JSON.stringify(dataContext)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: "Genera el análisis predictivo JSON",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      },
    });

    if (response.text()) {
      return JSON.parse(response.text()) as BusinessPrediction;
    }
    return null;
  } catch (error) {
    console.error("Error generating prediction:", error);
    return null;
  }
};
