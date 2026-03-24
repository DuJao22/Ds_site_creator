import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './src/db.js';
import { generateSiteHtml } from './src/htmlGenerator.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json());

// Initialize default admin if not exists
const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', hash, 'admin');
}

// --- API Routes ---

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  res.json(req.user);
});

// Dashboard Stats
app.get('/api/stats', authenticateToken, (req: any, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM sites').get() as any;
  const active = db.prepare("SELECT COUNT(*) as count FROM sites WHERE expires_at > datetime('now')").get() as any;
  const expired = db.prepare("SELECT COUNT(*) as count FROM sites WHERE expires_at <= datetime('now')").get() as any;
  const today = db.prepare("SELECT COUNT(*) as count FROM sites WHERE date(created_at) = date('now')").get() as any;
  
  res.json({
    total: total.count,
    active: active.count,
    expired: expired.count,
    today: today.count
  });
});

// Create Site
app.post('/api/sites', authenticateToken, (req: any, res) => {
  const { name, phone, address, city, description, services, map_link, image_url, duration_days } = req.body;
  
  // Generate slug
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  // Ensure unique slug
  let count = 1;
  let originalSlug = slug;
  while (db.prepare('SELECT id FROM sites WHERE slug = ?').get(slug)) {
    slug = `${originalSlug}-${count}`;
    count++;
  }

  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + parseInt(duration_days));

  const result = db.prepare(`
    INSERT INTO sites (slug, name, phone, address, city, description, services, map_link, image_url, expires_at, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(slug, name, phone, address, city, description, services, map_link, image_url, expires_at.toISOString(), req.user.id);

  res.json({ id: result.lastInsertRowid, slug });
});

// List Sites
app.get('/api/sites', authenticateToken, (req: any, res) => {
  const sites = db.prepare('SELECT * FROM sites ORDER BY created_at DESC').all();
  res.json(sites);
});

// Get Site by Slug (Public)
app.get('/api/sites/:slug', (req, res) => {
  const site = db.prepare('SELECT * FROM sites WHERE slug = ?').get(req.params.slug) as any;
  if (!site) return res.status(404).json({ error: 'Site não encontrado' });
  
  const isExpired = new Date(site.expires_at) <= new Date();
  
  res.json({ ...site, isExpired });
});

// Export Site as HTML (Public)
app.get('/api/sites/:slug/export', (req, res) => {
  const site = db.prepare('SELECT * FROM sites WHERE slug = ?').get(req.params.slug) as any;
  if (!site) return res.status(404).json({ error: 'Site não encontrado' });
  
  const html = generateSiteHtml(site);
  
  res.setHeader('Content-disposition', `attachment; filename=${site.slug}.html`);
  res.setHeader('Content-type', 'text/html');
  res.send(html);
});

// Expand URL
app.post('/api/expand-url', authenticateToken, async (req: any, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    const response = await fetch(url, { 
      method: 'GET', 
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    res.json({ url: response.url });
  } catch (error: any) {
    console.error('Error expanding URL:', error);
    res.status(500).json({ error: 'Failed to expand URL' });
  }
});

// Reactivate Site
app.post('/api/sites/:id/reactivate', authenticateToken, (req: any, res) => {
  const { duration_days } = req.body;
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + parseInt(duration_days));
  
  db.prepare('UPDATE sites SET expires_at = ? WHERE id = ?').run(expires_at.toISOString(), req.params.id);
  res.json({ success: true });
});

// Delete Site
app.delete('/api/sites/:id', authenticateToken, (req: any, res) => {
  db.prepare('DELETE FROM sites WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- Vercel Serverless Export ---
export default app;

// --- Local Development & Production Server ---
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  // Start Vite dev server
  createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  }).then((vite) => {
    app.use(vite.middlewares);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else if (!process.env.VERCEL) {
  // Serve static files in production (Render, Railway, VPS, etc.)
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}
