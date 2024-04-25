import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const createUser = async (req,res)=> {

    try {
        const user =  await User.create(req.body)
    res.status(201).json({user: user._id})    
    } catch (error) {
console.log("error", error)
let errors2 = {}

if(error.code === 11000){
    errors2.email = "the email is already registed "
}

if(error.name ==="ValidationError"){
    Object.keys(error.errors).forEach((key)=>{
        errors2[key] = error.errors[key].message;
    })
}
console.log("Errors2:::",errors2)

 res.status(400).json(errors2);
    };
    console.log("REQ BODY",req.body);   
};

const loginUser = async (req,res)=> {

    try {
        const {username, password} = req.body

        const user =  await User.findOne({username})

        let  same = false
        if (user) {
            same = await bcrypt.compare(password, user.password)
            
        }
        else{
           return res.status(401).json({
                succeded: false,
                error: "there is no such user"
            });
        }
        if (same) {
            const token = createToken(user._id)
            res.cookie(`jwt`,token,{
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            })
            res.redirect("/users/dashboard");
        }
        else{
            res.status(401).json({
                succeded: false,
                error: "passwords are not matched"
            });
        }
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    };
    console.log("REQ BODY",req.body);   
};

const createToken = (userId) =>{
    return jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: `1d`,
    })
}
const getDashboardPage = (req,res) =>{
    res.render(`dashboard`, {
        link : `dashboard`,
    });
};


export {createUser,loginUser,getDashboardPage};