import express from 'express';
import { aiChat, aiRecommendations, aiSearch } from '../controllers/aiController.js';
import authMiddleware from '../middleware/auth.js';

const aiRouter = express.Router();

// AI Chatbot endpoint - No auth required for basic queries
aiRouter.post("/chat", aiChat);

// AI Recommendations - Requires auth for personalized suggestions
aiRouter.post("/recommendations", authMiddleware, aiRecommendations);

// AI-powered search
aiRouter.post("/search", aiSearch);

export default aiRouter;