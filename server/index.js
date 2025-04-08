const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ API для замовлень користувача
app.get('/api/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    console.log(`📦 Отримання замовлень для користувача: ${userId}`);
    const snapshot = await db
      .collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`✅ Знайдено ${orders.length} замовлень`);
    res.json(orders);
  } catch (err) {
    console.error('❌ Помилка отримання замовлень:', err);
    res.status(500).send('Server error');
  }
});

// ✅ API для збереження нового замовлення
app.post('/api/orders', async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || Object.keys(items).length === 0) {
    return res.status(400).json({ error: 'Невірні дані або порожній кошик' });
  }

  try {
    const order = {
      userId,
      items,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('orders').add(order);
    const docSnap = await docRef.get();
    const createdOrder = { id: docRef.id, ...docSnap.data() };
    console.log('🕓 Дата створення (createdAt):', createdOrder.createdAt);

    res.status(201).json({ message: 'Замовлення збережено', order: createdOrder });
  } catch (err) {
    console.error('❌ Помилка збереження замовлення:', err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

const clientBuildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(clientBuildPath));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Сервер працює на http://localhost:${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});