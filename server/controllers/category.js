import express from 'express'
import mongoose from 'mongoose'

import ProductModel from '../models/Products.js'
import CategoryModel from '../models/Categories.js'

export const getCategories = async (req, res) => {
    try {
        const allCategory = await CategoryModel.find({}).sort({_id: -1});
        res.status(200).json({data: allCategory})
    } catch (error) {
        console.log(error)
    }
}

export const createCategory = async (req, res) => {
    try {
        const {categoryName} = req.body;
        const newCate = await new CategoryModel({
            categoryName
        });
        await newCate.save()
        res.status(201).json({status: 201, message: "Category Created"})
    } catch (error) {
        console.log(error)
    }
}

export const updateCategory = async (req, res) => {
    try {
        const {id} = req.params
        const {categoryName} = req.body;
        await new CategoryModel.findByIdAndUpdate(id, {...categoryName});
        res.status(200).json({status: 200, message: "Category Updated"})
    } catch (error) {
        console.log(error)
    }
}
export const deleteCategory = async (req, res) => {
    try {
        const {id} = req.params
        await new CategoryModel.findByIdAndRemove(id);
        res.status(200).json({status: 200, message: "Category Removed"})
    } catch (error) {
        console.log(error)
    }
}
