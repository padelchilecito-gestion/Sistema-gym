export enum TransactionType {
  INCOME = 'Ingreso',
  EXPENSE = 'Gasto',
}

export enum MembershipStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
  PENDING = 'Pendiente',
}

// Esto es TU plan como dueño del software (no tocar)
export type SubscriptionPlan = 'Basic' | 'Standard' | 'Full';

export interface GymSettings {
  name: string;
  logoUrl: string;
  plan: SubscriptionPlan; 
  // NUEVO: Aquí guardarás los precios que TÚ cobras a tus alumnos
  membershipPrices: {
    basic: number;        // Precio Cuota Básica
    intermediate: number; // Precio Cuota Intermedia
    full: number;         // Precio Cuota Full
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: MembershipStatus;
  balance: number; // Positivo = A favor, Negativo = Deuda
  plan: string;    // Aquí guardaremos 'basic', 'intermediate' o 'full'
  
  // New fields
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold';
  streak: number; 
  lastVisit: string;
  birthDate: string; 
  assignedRoutineId?: string;
  emergencyContact?: string;
  lastMembershipPayment?: string;
}

export interface Transaction {
  id: string;
  clientId?: string; 
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string; 
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  activeMembers: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
}

export interface CheckIn {
  id: string;
  clientId: string;
  clientName: string;
  timestamp: string; 
}

export interface Routine {
  id: string;
  name: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  description: string;
  exercisesCount: number;
}

export interface TimeSlot {
  hour: string; 
  occupancyScore: number; 
  isDeadHour: boolean;
}

export interface BusinessPrediction {
  predictedRevenue: number;
  revenueTrendPercentage: number; 
  summary: string;
  marketingStrategy: string;
  suggestedHappyHours: string[];
  hourlyHeatmap: TimeSlot[];
}
