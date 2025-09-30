/* eslint-disable @typescript-eslint/no-explicit-any */
import { Env, Hono } from "hono";
import { cors } from "hono/cors";
import { TDatabase } from "@/types/types";
import { zValidator } from "@hono/zod-validator";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import {
  CreateTransactionSchema,
  CreateCategorySchema,
  CreateSavingsGoalSchema,
  UpdateUserPreferencesSchema,
} from "@/types/types";

type MyEnv = Env & {
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
  DB: TDatabase ;
};

const app = new Hono<{ Bindings: MyEnv }>();

app.use("/*", cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));

// Auth endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Initialize user preferences and categories
app.post('/api/users/preferences/init', authMiddleware, async (c) => {
  const user = c.get('user')!;
  
  // Check if preferences already exist
  const existing = await c.env.DB.prepare(
    'SELECT * FROM user_preferences WHERE user_id = ?'
  ).bind(user.id).first();

  if (existing) {
    return c.json(existing);
  }

  // Create default categories for the user (copy from default template)
  const defaultCategories = await c.env.DB.prepare(
    'SELECT name, type, color FROM categories WHERE user_id = ?'
  ).bind('default').all();

  for (const category of defaultCategories.results as any[]) {
    await c.env.DB.prepare(`
      INSERT INTO categories (user_id, name, type, color)
      VALUES (?, ?, ?, ?)
    `).bind(user.id, category.name, category.type, category.color).run();
  }

  // Create default preferences
  const result = await c.env.DB.prepare(`
    INSERT INTO user_preferences (user_id, monthly_income, currency, savings_rate, budget_allocation)
    VALUES (?, 0, 'AOA', 0.2, '{"alimentação": 30, "transporte": 20, "lazer": 15, "poupança": 20, "outros": 15}')
  `).bind(user.id).run();

  const preferences = await c.env.DB.prepare(
    'SELECT * FROM user_preferences WHERE id = ?'
  ).bind(result.meta.last_row_id).first();

  return c.json(preferences);
});

// Get user preferences
app.get('/api/users/preferences', authMiddleware, async (c) => {
  const user = c.get('user')!;
  
  const preferences = await c.env.DB.prepare(
    'SELECT * FROM user_preferences WHERE user_id = ?'
  ).bind(user.id).first();

  if (!preferences) {
    return c.json({ error: 'Preferences not found' }, 404);
  }

  return c.json(preferences);
});

// Update user preferences
app.put('/api/users/preferences', authMiddleware, zValidator('json', UpdateUserPreferencesSchema), async (c) => {
  const user = c.get('user')!;
  const updates = c.req.valid('json');
  
  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), new Date().toISOString(), user.id];
  
  await c.env.DB.prepare(`
    UPDATE user_preferences 
    SET ${setClause}, updated_at = ?
    WHERE user_id = ?
  `).bind(...values).run();

  const updated = await c.env.DB.prepare(
    'SELECT * FROM user_preferences WHERE user_id = ?'
  ).bind(user.id).first();

  return c.json(updated);
});

// Dashboard data
app.get('/api/dashboard', authMiddleware, async (c) => {
  const user = c.get('user')!;
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  // Get monthly totals
  const monthlyStats = await c.env.DB.prepare(`
    SELECT 
      type,
      SUM(amount) as total
    FROM transactions 
    WHERE user_id = ? AND strftime('%Y-%m', transaction_date) = ?
    GROUP BY type
  `).bind(user.id, currentMonth).all();

  const totalIncome = Number(monthlyStats.results.find((s: any) => s.type === 'income')?.total) || 0;
  const totalExpenses = Number(monthlyStats.results.find((s: any) => s.type === 'expense')?.total) || 0;
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  // Get category breakdown
  const categoryBreakdown = await c.env.DB.prepare(`
    SELECT 
      category,
      SUM(amount) as amount
    FROM transactions 
    WHERE user_id = ? AND type = 'expense' AND strftime('%Y-%m', transaction_date) = ?
    GROUP BY category
  `).bind(user.id, currentMonth).all();

  const categoryData = categoryBreakdown.results.map((cat: any) => ({
    category: cat.category,
    amount: Number(cat.amount),
    percentage: totalExpenses > 0 ? (Number(cat.amount) / totalExpenses) * 100 : 0,
  }));

  // Get last 6 months income vs expenses
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyTrends = await c.env.DB.prepare(`
    SELECT 
      strftime('%Y-%m', transaction_date) as month,
      type,
      SUM(amount) as total
    FROM transactions 
    WHERE user_id = ? AND transaction_date >= ?
    GROUP BY month, type
    ORDER BY month
  `).bind(user.id, sixMonthsAgo.toISOString().slice(0, 10)).all();

  const trendData: { [key: string]: { income: number; expenses: number } } = {};
  monthlyTrends.results.forEach((trend: any) => {
    if (!trendData[trend.month]) {
      trendData[trend.month] = { income: 0, expenses: 0 };
    }
    trendData[trend.month][trend.type === 'income' ? 'income' : 'expenses'] = Number(trend.total);
  });

  const incomeVsExpenses = Object.entries(trendData).map(([month, data]) => ({
    month,
    income: data.income,
    expenses: data.expenses,
  }));

  // Calculate monthly growth
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = lastMonth.toISOString().slice(0, 7);
  
  const lastMonthSavings = incomeVsExpenses.find(m => m.month === lastMonthStr);
  const currentMonthSavings = totalSavings;
  const lastMonthSavingsAmount = lastMonthSavings ? lastMonthSavings.income - lastMonthSavings.expenses : 0;
  
  const monthlyGrowth = lastMonthSavingsAmount > 0 
    ? ((currentMonthSavings - lastMonthSavingsAmount) / lastMonthSavingsAmount) * 100 
    : 0;

  return c.json({
    totalIncome,
    totalExpenses,
    totalSavings,
    savingsRate,
    monthlyGrowth,
    categoryBreakdown: categoryData,
    incomeVsExpenses,
  });
});

// Transactions
app.get('/api/transactions', authMiddleware, async (c) => {
  const user = c.get('user')!;
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = (page - 1) * limit;
  
  const { results } = await c.env.DB.prepare(`
    SELECT * FROM transactions 
    WHERE user_id = ? 
    ORDER BY transaction_date DESC, created_at DESC
    LIMIT ? OFFSET ?
  `).bind(user.id, limit, offset).all();

  return c.json(results);
});

app.post('/api/transactions', authMiddleware, zValidator('json', CreateTransactionSchema), async (c) => {
  const user = c.get('user')!;
  const transaction = c.req.valid('json');
  
  const result = await c.env.DB.prepare(`
    INSERT INTO transactions (user_id, type, amount, category, description, is_recurring, recurring_interval, transaction_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    user.id,
    transaction.type,
    transaction.amount,
    transaction.category,
    transaction.description || null,
    transaction.is_recurring,
    transaction.recurring_interval || null,
    transaction.transaction_date
  ).run();

  const created = await c.env.DB.prepare(
    'SELECT * FROM transactions WHERE id = ?'
  ).bind(result.meta.last_row_id).first();

  return c.json(created, 201);
});

// Categories
app.get('/api/categories', authMiddleware, async (c) => {
  const user = c.get('user')!;
  const type = c.req.query('type'); // 'income' or 'expense'
  
  let query = 'SELECT * FROM categories WHERE user_id = ?';
  const params = [user.id];
  
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }
  
  query += ' ORDER BY name';
  
  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(results);
});

app.post('/api/categories', authMiddleware, zValidator('json', CreateCategorySchema), async (c) => {
  const user = c.get('user')!;
  const category = c.req.valid('json');
  
  const result = await c.env.DB.prepare(`
    INSERT INTO categories (user_id, name, type, color)
    VALUES (?, ?, ?, ?)
  `).bind(
    user.id,
    category.name,
    category.type,
    category.color || '#6366f1'
  ).run();

  const created = await c.env.DB.prepare(
    'SELECT * FROM categories WHERE id = ?'
  ).bind(result.meta.last_row_id).first();

  return c.json(created, 201);
});

// Savings goals
app.get('/api/savings-goals', authMiddleware, async (c) => {
  const user = c.get('user')!;
  
  const { results } = await c.env.DB.prepare(`
    SELECT * FROM savings_goals 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `).bind(user.id).all();

  return c.json(results);
});

app.post('/api/savings-goals', authMiddleware, zValidator('json', CreateSavingsGoalSchema), async (c) => {
  const user = c.get('user')!;
  const goal = c.req.valid('json');
  
  const result = await c.env.DB.prepare(`
    INSERT INTO savings_goals (user_id, name, target_amount, target_date, description)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    user.id,
    goal.name,
    goal.target_amount,
    goal.target_date || null,
    goal.description || null
  ).run();

  const created = await c.env.DB.prepare(
    'SELECT * FROM savings_goals WHERE id = ?'
  ).bind(result.meta.last_row_id).first();

  return c.json(created, 201);
});

export default app;
