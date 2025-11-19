import express from 'express'
import { 
    getPublishedImages, 
    getUser, 
    loginUser, 
    registerUser 
} from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const userRouter = express.Router();

// Register user
userRouter.post('/register', registerUser);

// Login user
userRouter.post('/login', loginUser);

// Get authenticated user data
userRouter.get('/data', protect, getUser);

// Get published images (public)
userRouter.get('/published-images', getPublishedImages);

export default userRouter;
