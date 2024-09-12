import { Server } from 'socket.io';
import { createPatientWithGpt, getPatientById } from '../handlers/patientHandler.js';
import { handleChatProcessing, handleEvaluateDiagnosis, handleEvaluateTest } from '../handlers/chatHandler.js';

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

      socket.on('user_message_TEST', (message) => {
        console.log(message,"message")
        handleEvaluateTest(message).then((response)=>{
          socket.emit("assistant_message",response)

        })
      });

      socket.on('user_message_DIAGNOSIS', (message) => {
        console.log(message,"message")
        handleEvaluateDiagnosis(message).then((response)=>{
          socket.emit("assistant_message",response)
        })
      });
      
      socket.on('start_game', (message) => {
        handleChatProcessing(message).then((response)=>{
          socket.emit("assistant_message",response)
        })
      });
      socket.on("get_new_patient",(patient_id)=>{
        getPatientById(patient_id).then((response)=>{
         socket.emit('patient_details',response)
        })
      })

      socket.on("get_new_patient_from_gpt",(patient_id)=>{
        createPatientWithGpt().then((response)=>{
         socket.emit('patient_details',response)
        })
      })
      socket.on('user_message', (message) => {
        console.log('A user disconnected');
      });

    });
  }

}

export default SocketService;
