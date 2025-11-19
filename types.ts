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

export interface GymSettings {
  name: string;
  logoUrl: string;
  plan: SubscriptionPlan;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: MembershipStatus;
  balance: number; // Positive means they owe money, negative means credit
  plan: string;
  // New fields for Engagement & CRM
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold';
  streak: number; // Current streak in days
  lastVisit: string; // ISO Date
  birthDate: string; // YYYY-MM-DD
  assignedRoutineId?: string;
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

// AI Prediction Types
export interface TimeSlot {
  hour: string; // "08:00"
  occupancyScore: number; // 0-100
  isDeadHour: boolean;
}

export interface BusinessPrediction {
  predictedRevenue: number;
  revenueTrendPercentage: number; // e.g. -10 or +5
  summary: string;
  marketingStrategy: string;
  suggestedHappyHours: string[];
  hourlyHeatmap: TimeSlot[];
}