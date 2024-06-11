import express from 'express';
import logger from 'morgan';
import cors from 'cors';



import contactsRouter from './routes/api/contacts.js'
import { connectToDb } from './utils/connectDb.js';

import authRouter from './routes/api/auth.js'


const app = express();

connectToDb();


const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(express.static('public'))
// verificarea existentei folderului public
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)
app.use('/users', authRouter )

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

export default app;
