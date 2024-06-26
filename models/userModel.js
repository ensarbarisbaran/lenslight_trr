import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt";
import validator from "validator";

const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true,"username area is required"],
        lowercase: true,
        validate: [validator.isAlphanumeric,"Only Alphanumeric characters"]
    },
    email: {
        type: String,
        required: [true,"email area is required"],
        unique : true,
        validate:[validator.isEmail,"Valid email is required"]
    },
    password:{
        type: String,
        required: [true,"password area is required"],
        minLength: [4,"At least 4 characters"]
    },
},
{
    timestamps: true,
}
);

userSchema.pre("save", function(next){
    const user = this
    bcrypt.hash(user.password, 10, (err,hash) =>{
        user.password = hash;
        next();
    })

})

const User = mongoose.model("User", userSchema)

export default User;