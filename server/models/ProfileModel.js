import mongoose from 'mongoose'

const profileSchema = mongoose.Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    phoneNumber: String,
    businessName: String,
    contactAddress: String, 
    logo: String,
    website: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
})

const Profile = mongoose.model('Profile', profileSchema)

export default Profile