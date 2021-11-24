import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'



const app = express()
dotenv.config()

import invoiceRoutes from './routes/invoices.js'
import clientRoutes from './routes/clients.js'
import userRoutes from './routes/userRoutes.js'
import profile from './routes/profile.js'

app.get('/', (req, res) => {
    res.send('Server is running')
  })

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT || 3001

app.use('/users', userRoutes)
app.use('/profiles', profile)
app.use('/clients', clientRoutes)
app.use('/invoices', invoiceRoutes)

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log("DB error" + error.message))
