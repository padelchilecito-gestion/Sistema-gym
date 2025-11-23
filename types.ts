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

// NUEVO: Definimos los roles disponibles
export type UserRole = 'admin' | 'instructor' | 'client';

export interface GymSettings {
  name: string;
  logoUrl: string;
  plan: SubscriptionPlan; 
  membershipPrices: {
    basic: number;
    intermediate: number;
    full: number;
  };
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
  assignedRoutineId?: string;
  emergencyContact?: string;
  lastMembershipPayment?: string;
  password?: string; // NUEVO: Contraseña para que el cliente entre a su portal
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
