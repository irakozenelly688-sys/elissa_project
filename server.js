const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./db');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static SPA files
app.use('/', express.static(path.join(__dirname, 'public')));

// API: get all tools
app.get('/api/tools', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tools');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// API: rent a tool (create rental and decrement quantity)
app.post('/api/rent', async (req, res) => {
  const { tool_id, renter_name, renter_contact, start_date, end_date } = req.body;
  if (!tool_id || !renter_name || !start_date) {
    return res.status(400).json({ error: 'tool_id, renter_name and start_date are required' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Check availability
    const [toolRows] = await conn.query('SELECT quantity FROM tools WHERE id = ? FOR UPDATE', [tool_id]);
    if (toolRows.length === 0) throw new Error('Tool not found');
    if (toolRows[0].quantity <= 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Tool not available' });
    }

    // Insert rental
    const [r] = await conn.query(
      'INSERT INTO rentals (tool_id, renter_name, renter_contact, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [tool_id, renter_name, renter_contact || null, start_date, end_date || null, 'active']
    );

    // Decrement quantity
    await conn.query('UPDATE tools SET quantity = quantity - 1 WHERE id = ?', [tool_id]);

    await conn.commit();
    res.json({ success: true, rental_id: r.insertId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to rent' });
  } finally {
    conn.release();
  }
});

// API: return a tool (mark rental returned and increment quantity)
app.post('/api/return', async (req, res) => {
  const { rental_id } = req.body;
  if (!rental_id) return res.status(400).json({ error: 'rental_id required' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [rentRows] = await conn.query('SELECT * FROM rentals WHERE id = ? FOR UPDATE', [rental_id]);
    if (rentRows.length === 0) throw new Error('Rental not found');
    const rental = rentRows[0];
    if (rental.status !== 'active') {
      await conn.rollback();
      return res.status(400).json({ error: 'Rental not active' });
    }

    // Update rental
    await conn.query('UPDATE rentals SET status = ?, end_date = COALESCE(end_date, CURDATE()) WHERE id = ?', ['returned', rental_id]);

    // Increase tool quantity
    await conn.query('UPDATE tools SET quantity = quantity + 1 WHERE id = ?', [rental.tool_id]);

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to return' });
  } finally {
    conn.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});