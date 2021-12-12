import mongoose from 'mongoose'

import InvoiceModel from '../models/InvoiceModel.js'
import ProductModel from '../models/Products.js'

export const getInvoicesByUser = async (req, res) => {
    const {searchQuery} = req.query;
    let invoices;
    try {
        if(searchQuery) {
            invoices = await InvoiceModel.find({ creator: searchQuery });
        }
        else {
            invoices = await InvoiceModel.find();
        }
        // const invoices = await InvoiceModel.find().where('creator').in(searchQuery);

        res.status(200).json({ data: invoices });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}


export const getInvoices = async (req, res) => {

    try {
        const allInvoices = await InvoiceModel.find({}).sort({_id:-1}) 
        //find({}).sort({_id:-1}) to sort according to date of creation

        res.status(200).json(allInvoices)

    } catch (error) {
        res.status(409).json(error.message)
        
    }
    
}




export const createInvoice = async (req, res) => {

    const invoice = req.body

    await Promise.all(
        invoice.items.map(async item => {
            const findProduct = await ProductModel.findOne({productName: item.itemName});
            findProduct.quantity = findProduct.quantity - item.quantity;
            await findProduct.save();
        })
    )

    const newInvoice = new InvoiceModel(invoice)

    try {
        await newInvoice.save()
        res.status(201).json(newInvoice)
    } catch (error) {
        res.status(409).json(error.message)
    }

}

export const getInvoice = async (req, res) => { 
    const { id } = req.params;
    try {
        const invoice = await InvoiceModel.findById(id);
        
        res.status(200).json(invoice);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const updateInvoice = async (req, res) => {
    const { id: _id } = req.params
    const invoice = req.body
    console.log(invoice);

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No invoice with that id')

    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(_id, {...invoice, _id}, { new: true})

    res.status(200).json(updatedInvoice)
}


export const deleteInvoice = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No invoice with that id')

    await InvoiceModel.findByIdAndRemove(id)

    res.json({message: 'Invoice deleted successfully'})
}