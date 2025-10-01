import z from "zod";
import { PrismaClient } from "@prisma/client";

// Transaction schemas
export const TransactionSchema = z.object({
  id: z.string(), // cuid()
  user_id: z.string(),
  type: z.enum(['income', 'expense']), // alinhar com enum Prisma
  amount: z.number().positive(),
  category_id: z.number().nullable(), // chave estrangeira
  description: z.string().optional(),
  is_recurring: z.boolean().default(false),
  recurring_interval: z.string().optional(),
  transaction_date: z.string().datetime(), // ISO
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  category: z.string(),
  description: z.string().optional(),
  is_recurring: z.boolean().default(false),
  recurring_interval: z.string().optional(),
  transaction_date: z.string(),
});

// Category schemas
export const CategorySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  name: z.string(),
  type: z.enum(['income', 'expense']),
  color: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateCategorySchema = z.object({
  name: z.string(),
  type: z.enum(['income', 'expense']),
  color: z.string().optional(),
});

// Savings goal schemas
export const SavingsGoalSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  name: z.string(),
  target_amount: z.number().positive(),
  current_amount: z.number().default(0),
  target_date: z.string().optional(),
  description: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateSavingsGoalSchema = z.object({
  name: z.string(),
  target_amount: z.number().positive(),
  target_date: z.string().optional(),
  description: z.string().optional(),
});

// User preferences schema
export const UserPreferencesSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  monthly_income: z.number().default(0),
  currency: z.string().default('AOA'),
  savings_rate: z.number().default(0.2),
  budget_allocation: z.string().optional(), // JSON string
  created_at: z.string(),
  updated_at: z.string(),
});

export const UpdateUserPreferencesSchema = z.object({
  monthly_income: z.number().positive().optional(),
  currency: z.string().optional(),
  savings_rate: z.number().min(0).max(1).optional(),
  budget_allocation: z.string().optional(),
});

// Dashboard data types
export const DashboardDataSchema = z.object({
  totalIncome: z.number(),
  totalExpenses: z.number(),
  totalSavings: z.number(),
  savingsRate: z.number(),
  monthlyGrowth: z.number(),
  categoryBreakdown: z.array(z.object({
    category: z.string(),
    amount: z.number(),
    percentage: z.number(),
  })),
  incomeVsExpenses: z.array(z.object({
    month: z.string(),
    income: z.number(),
    expenses: z.number(),
  })),
});

export type TDatabase = Omit<PrismaClient, '$on' | '$use' | '$transaction'> &
  Partial<Pick<PrismaClient, '$transaction'>>;

// Type exports
export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type SavingsGoal = z.infer<typeof SavingsGoalSchema>;
export type CreateSavingsGoal = z.infer<typeof CreateSavingsGoalSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UpdateUserPreferences = z.infer<typeof UpdateUserPreferencesSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
