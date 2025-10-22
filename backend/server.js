const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acesso negado' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  console.log('Recebida requisição de cadastro:', req.body);
  const { full_name, birth_date, email, password } = req.body;
  if (!full_name || !birth_date || !email || !password) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (full_name, birth_date, email, password) VALUES (?, ?, ?, ?)',
      [full_name, birth_date, email, hashedPassword]
    );
    res.status(201).json({ message: 'Usuário criado' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Email já existe' });
    } else {
      res.status(500).json({ error: 'Erro no servidor' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  console.log('Recebida requisição de login:', req.body);
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.get('/api/profile', authenticateJWT, async (req, res) => {
  try {
    const [userRows] = await db.query('SELECT full_name, birth_date, email, profile_pic, bio FROM users WHERE id = ?', [req.user.id]);
    const [postsRows] = await db.query('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    const [commentsRows] = await db.query('SELECT * FROM comments WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);

    res.json({ user: userRows[0], posts: postsRows, comments: commentsRows });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.put('/api/profile', authenticateJWT, async (req, res) => {
  console.log('Recebida requisição de edição de perfil:', req.body);
  const { full_name, email, bio, profile_pic, password } = req.body;
  if (!full_name && !email && !bio && !profile_pic && !password) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  try {
    const updates = {};
    const values = [];
    if (full_name) {
      updates.full_name = full_name;
      values.push(full_name);
    }
    if (email) {
      updates.email = email;
      values.push(email);
    }
    if (bio !== undefined) {
      updates.bio = bio;
      values.push(bio);
    }
    if (profile_pic) {
      updates.profile_pic = profile_pic;
      values.push(profile_pic);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
      values.push(hashedPassword);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualização' });
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    values.push(req.user.id);

    await db.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Email já existe' });
    } else {
      res.status(500).json({ error: 'Erro no servidor' });
    }
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, u.full_name, u.profile_pic 
      FROM posts p JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.post('/api/posts', authenticateJWT, async (req, res) => {
  const { title, content } = req.body;
  if (!content) return res.status(400).json({ error: 'Conteúdo obrigatório' });

  try {
    await db.query('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [title, content, req.user.id]);
    res.status(201).json({ message: 'Post criado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, u.full_name, u.profile_pic 
      FROM comments c JOIN users u ON c.user_id = u.id 
      WHERE c.post_id = ? ORDER BY c.created_at ASC
    `, [req.params.postId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.post('/api/posts/:postId/comments', authenticateJWT, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Conteúdo obrigatório' });

  try {
    await db.query('INSERT INTO comments (content, post_id, user_id) VALUES (?, ?, ?)', [content, req.params.postId, req.user.id]);
    res.status(201).json({ message: 'Comentário adicionado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));