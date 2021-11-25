import mongoose from 'mongoose'

const ProductSchema = mongoose.Schema({
    productName: String,
    quantity: Number,
    price: Number,
    image: String,
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'CategoryModel'},
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const ProductModel = mongoose.model('ProductModel', ProductSchema)
export default ProductModel