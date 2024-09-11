import express from 'express';
import User from '../models/Users.js';
import _ from 'lodash';
import { handleChatProcessing } from '../handlers/chatHandler.js';

const router = express.Router();


router.get("/test-initial-message", async (req, res) => {
    try {
      await handleChatProcessing()
  
      res.status(200).json({"message":"done"});
  
    } catch (e) {
      res.status(500).json({ error: 'Error fetching user' });
  
    }
  });
export default router;
