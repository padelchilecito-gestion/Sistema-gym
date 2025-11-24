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
  routineStartDate?: string; 
  emergencyContact?: string;
  lastMembershipPayment?: string;
  password?: string; 
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

// NUEVO: Definición de un Ejercicio individual
export interface Exercise {
  id: string;
  name: string;        // Ej: "Prensa 45°"
  machine?: string;    // Ej: "Máquina #3 - Zona Piernas"
  sets: number;        // Ej: 4
  reps: string;        // Ej: "12-15" o "Fallo"
  notes?: string;      // Ej: "Bajar lento, subir explosivo"
  completed?: boolean; // Para el estado local del cliente (no se guarda en DB rutina general)
}

// ACTUALIZADO: Rutina ahora contiene una lista de ejercicios
export interface Routine {
  id: string;
  name: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  description: string;
  exercises: Exercise[]; // Lista de ejercicios
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
