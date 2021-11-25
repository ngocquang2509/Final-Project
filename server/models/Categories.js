import mongoose from 'mongoose'

const CategorySchema = mongoose.Schema({
    categoryName: String,
    createdAt: {type: Date, default: new Date()}
})

const CategoryModel = mongoose.model('CategoryModel', CategorySchema)
export default CategoryModel