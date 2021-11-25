import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import nodemailer from 'nodemailer'




const app = express()
dotenv.config()

import invoiceRoutes from './routes/invoices.js'
import clientRoutes from './routes/clients.js'
import userRoutes from './routes/userRoutes.js'
import productRouters from './routes/products.js'
import cateRouter from './routes/categories.js'
import profile from './routes/profile.js'

import pdf from 'html-pdf'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pdfTemplate from './documents/index.js'
import emailTemplate from './documents/email.js'



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
  origin: "*",
  credentials: false
}))

app.use((express.json({ limit: "30mb", extended: true})))
app.use((express.urlencoded({ limit: "30mb", extended: true})))
app.use((cors()))
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('Server is running')
  })

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT || 3001

app.use('/users', userRoutes)
app.use('/profiles', profile)
app.use('/clients', clientRoutes)
app.use('/invoices', invoiceRoutes)
app.use('/products', productRouters)
app.use('/categories', cateRouter)


// NODEMAILER TRANSPORT FOR SENDING INVOICE VIA EMAIL
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port : process.env.SMTP_PORT,
  secure: true,
  auth: {
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS
  },
  tls:{
      rejectUnauthorized:false
  }
})

var options = { format: 'A4' };
//SEND PDF INVOICE VIA EMAIL
app.post('/send-pdf', (req, res) => {
    const { email, company } = req.body
    console.log(email);

    // pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
    pdf.create(pdfTemplate(req.body), options).toFile('invoice.pdf', (err) => {
       
          // send mail with defined transport object
        transporter.sendMail({
            from: `${company.businessName ? company.businessName : company.name} <hello@arcinvoice.com>`, // sender address
            to: `${email}`, // list of receivers
            replyTo: `${company.email}`,
            subject: `Invoice from ${company.businessName ? company.businessName : company.name}`, // Subject line
            text: `Invoice from ${company.businessName ? company.businessName : company.name }`, // plain text body
            html: emailTemplate(req.body), // html body
            attachments: [{
                filename: 'invoice.pdf',
                path: `${__dirname}/invoice.pdf`
            }]
        });

        if(err) {
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    });
});

//CREATE AND SEND PDF INVOICE
app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    });
});

//SEND PDF INVOICE
app.get('/fetch-pdf', (req, res) => {
     res.sendFile(`${__dirname}/invoice.pdf`)
})

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log("DB error" + error.message))
