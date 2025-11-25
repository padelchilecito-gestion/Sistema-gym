export enum TransactionType {
  INCOME = 'Ingreso',
  EXPENSE = 'Gasto',
}

export enum MembershipStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
  PENDING = 'Pendiente',
}

export type SubscriptionPlan = 'Basic' | 'Standard' | 'Full';

export type UserRole = 'admin' | 'instructor' | 'client';

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor';
  password?: string; 
}

export interface Reward {
  id: string;
  name: string;
  points: number;
}

export interface GymSettings {
  name: string;
  logoUrl: string;
  plan: SubscriptionPlan; 
  membershipPrices: {
    basic: number;
    intermediate: number;
    full: number;
  };
  rewards?: Reward[];
}

// Estructura para el historial de rutinas
export interface CompletedRoutine {
  date: string;
  routineName: string;
  pointsEarned: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: MembershipStatus;
  balance: number; 
  plan: string;
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold';
  streak: number; 
  lastVisit: string;
  birthDate: string; 
  assignedRoutineId?: string | null;
  routineStartDate?: string | null; 
  emergencyContact?: string;
  lastMembershipPayment?: string;
  password?: string; 
  routineHistory?: CompletedRoutine[]; // Historial de últimas 7 rutinas
}

export interface Transaction {
  id: string;
  clientId?: string;
  clientName?: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
  createdBy?: string; 
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
  checkoutTimestamp?: string | null;
}

export interface Exercise {
  id: string;
  name: string;
  machine?: string;
  sets: number;
  reps: string;
  notes?: string;
  completed?: boolean; 
}

export interface Routine {
  id: string;
  name: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  description: string;
  exercises: Exercise[]; 
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
