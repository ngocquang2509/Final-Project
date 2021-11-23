import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'



const app = express()
dotenv.config()

app.use('/invoices', invoiceRoutes)
app.use('/clients', clientRoutes)
app.use('/users', userRoutes)
app.use('/profiles', profile)


app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING')
  })

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT || 3001

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message))
