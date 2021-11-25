import express from 'express'
import mongoose from 'mongoose'

import ProductModel from '../models/Products.js'
import CategoryModel from '../models/Categories.js'

export const getAllProduct = async (req, res) => {
    try {
        const allProduct = await ProductModel.find({}).sort({_id: -1});
        const response = await Promise.all(
            allProduct.map(async item => {
                const category = await CategoryModel.findById(item.categoryId);
                return {
                    name: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    category: category.categoryName
                }
            })
        )
        res.status(200).json({data: response})
    } catch (error) {
        console.log(error)
    }
}


export const createProduct = async (req, res) => {
    try {
        const {productName, quantity, price, image, categoryName}= req.body
        const cateogryFind = await CategoryModel.findOne({categoryName})
        const newProduct = await new ProductModel({
            productName,
            quantity,
            price,
            image,
            categoryId: cateogryFind._id
        })
        await newProduct.save();
        res.status(201).json({status: 201, message: "Product Created"});
    } catch (error) {
        console.log(error)
    }
}
export const updateProduct = async (req, res) => {
    try {
        const {productId} = req.params;
        const updateObj = req.body;
        await ProductModel.findByIdAndUpdate(productId, {...updateObj});
        res.status(200).json({status: 200, message: "Product Updated"})
    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const {productId} = req.params;
        await ProductModel.findByIdAndDelete(productId);
        res.status(200).json({status: 200, message: "Product Deleted"})
    } catch (error) {
        console.log(error)
    }
}