const express = require('express');
const cors = require('cors');
const documentsRouter = require('./routes/documents.js');
const eventsRouter = require('./routes/events.js');
const newsRouter = require('./routes/news.js');
const authRouter = require('./routes/auth.js');
const notificationRouter = require('./routes/notifications.js');
const auditRouter = require('./routes/audit.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/documents', documentsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/news', newsRouter);
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/audit', auditRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));