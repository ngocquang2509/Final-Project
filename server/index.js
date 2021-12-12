import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import nodemailer from 'nodemailer'
import UserModel from './models/userModel.js'
import ProfileModel from './models/ProfileModel.js'
import bcrypt from 'bcryptjs'
import path from 'path'
dotenv.config()

const app = express()

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

app.get('/api/', (req, res) => {
    res.send('Server is running')
  })

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT || 5000

app.use('/api/users', userRoutes)
app.use('/api/profiles', profile)
app.use('/api/clients', clientRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/products', productRouters)
app.use('/api/categories', cateRouter)


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
app.post('/api/send-pdf', (req, res) => {
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
app.post('/api/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    });
});

//SEND PDF INVOICE
app.get('/api/fetch-pdf', (req, res) => {
     res.sendFile(`${__dirname}/invoice.pdf`)
})

const init = async () => {
    const count = await UserModel.estimatedDocumentCount();
    if(count === 0) {
        const admin = await new UserModel({
            email: "admin@admin.com",
            password: await bcrypt.hash("admin", 12),
            name: "Administrator",
            role: "Admin",
        })
        await admin.save();
        const newProfile = new ProfileModel({
            name: "Administrator",
            email: "admin@admin.com",
            phoneNumber: "0987432123",
            businessName: "NQ WAREHOUSE MANAGEMENT",
            contactAddress: "25 Phuoc Truong 2, Son Tra, Da Nang", 
            userId: admin._id,
            createdAt: new Date().toISOString() 
          })
          await newProfile.save();
          console.log("db init succeed");
    }
}

console.log(DB_URL)

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
    .then(() => {init(); app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))})
    .catch((error) => console.log("DB error" + error.message + DB_URL))
