import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import creditRouter from './routes/creditRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())

await connectDb();

app.get('/', (req, res) => {
    return res.json({
        message: 'Server is live.'
    })
})

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})