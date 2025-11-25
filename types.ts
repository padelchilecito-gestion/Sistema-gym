export enum TransactionType {
  INCOME = 'Ingreso',
  EXPENSE = 'Gasto',
}

export enum MembershipStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
  PENDING = 'Pendiente',
}

// EDITADO: Agregamos 'CrossFit' como un plan de suscripción del software
export type SubscriptionPlan = 'Basic' | 'Standard' | 'Full' | 'CrossFit';

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
    crossfit: number; // NUEVO: Precio para la cuota de CrossFit
  };
  rewards?: Reward[];
}

// Estructura para el historial de rutinas (Gym Tradicional)
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
  plan: string; // 'basic', 'intermediate', 'full', 'crossfit'
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
  routineHistory?: CompletedRoutine[]; 
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

// --- ESTRUCTURAS TRADICIONALES ---
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

// --- NUEVAS ESTRUCTURAS: MODO CROSSFIT ---

export type WodType = 'AMRAP' | 'EMOM' | 'FOR_TIME' | 'TABATA' | 'STRENGTH';

export interface WOD {
  id: string;
  date: string; // Fecha para la que está programado
  name: string; // Ej: "Murph", "Fran" o "WOD Martes"
  type: WodType;
  description: string; // El texto completo del WOD
  timeCap?: number; // En minutos
  exercises?: string[]; // Lista simple de ejercicios si se desea
}

export interface ClassSession {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  coachId: string;
  coachName: string;
  capacity: number;
  attendees: string[]; // IDs de clientes reservados
  wodId?: string; // WOD asignado a esta clase
}

export interface Booking {
  id: string;
  classId: string;
  clientId: string;
  clientName: string;
  timestamp: string; // Cuándo reservó
  status: 'confirmed' | 'cancelled' | 'waitlist';
}

export interface WODScore {
  id: string;
  wodId: string;
  clientId: string;
  clientName: string;
  date: string;
  score: string; // Ej: "15:30", "12 Rounds + 5"
  isRx: boolean; // True = RX, False = Scaled
  notes?: string;
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
