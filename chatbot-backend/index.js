import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './db.js';
import patientRoutes from './routes/api.patients.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/api/patients', patientRoutes);

app.get('/', (req, res) => {
  res.send('Api is running');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // socket.on('chat_message', async (message) => {
  //   console.log('Received message:', message); // implement later
  // });
});

sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL database.');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
