import express from 'express';
import Patient from '../models/Patient.js';
import _  from 'lodash';
import { createPatientWithGpt } from '../handlers/patientHandler.js';

const router = express.Router();

router.get('/list', async (req, res) => {
  try {
    const patients = await Patient.findAll();
    if (patients.length === 0) {
      return res.status(404).json({ error: 'No patients found' });
    }
    res.status(200).json(patients); 
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});

router.post('/add', async (req, res) => {
  try {
    if (!req.body || _.isEmpty(req.body)) {
      throw 'Patient data is required Req Body Cannot Be Empty'  
    }

    const patient = await Patient.create(req.body);
    res.status(201).json(patient); 

  } catch (error) {
    console.log(error)
    res.status(500).json({ 
      error: 'Internal Server Error' ,
      message:error

    }); 
  }
});


router.post('/create-new-patient-with-ai', async (req, res) => {
  try {
    const patient = await createPatientWithGpt()
    res.status(201).json(patient); 

  } catch (error) {
    console.log(error)
    res.status(500).json({ 
      error: 'Internal Server Error' ,
      message:error

    }); 
  }
});



export default router;
