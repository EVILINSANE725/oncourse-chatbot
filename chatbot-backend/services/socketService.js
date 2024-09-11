import { Server } from 'socket.io';

class SocketService {
  constructor(server) {
    this.io = new Server(server, { cors: { origin: '*' } });
    this.configureEvents();
  }

  configureEvents() {
    this.io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });

      socket.on('user_message', (message) => {
        console.log('A user disconnected');
      });

    });
  }

}

export default SocketService;
