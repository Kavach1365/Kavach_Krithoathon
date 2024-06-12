import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from '../models/user.model.js'

export const signup = async (req,res)=>{
   try{
    const {username,fullName,password,email} = req.body;

    const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    if(!emailRegex.test(email)){
        return res.status(400).json({error:'Invalid email'})
    }
    
    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(400).json({error:'Username already taken'})
    }
    const existingEmail = await User.findOne({email});
    if(existingEmail){
        return res.status(400).json({error:'Email already taken'})
    }

    if(password.length < 6){
        return res.status(400).json({error:'Password length is too short'})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new User({
        fullName:fullName,
        email:email,
        username:username,
        password:hashedPassword
    })

    if(newUser){
        await newUser.save()
        //console.log(newUser._id);
        generateTokenAndSetCookie(newUser._id,res)

        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            username:newUser.username,
            profileImg:newUser.profileImg,
            coverImg:newUser.coverImg,
            bio:newUser.bio,
            link:newUser.link,
        })
    }
    else{
        res.status(400).json({error:"Invalid User Data"})
    }


   }catch(error){
        console.log("Error in Signup controller",error);
        res.status(500).json({error:"Internal Server Error:"})
   }
};

export const login = async (req,res)=>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username})
        const isPassword = await bcrypt.compare(password,user.password || "")
        if(!user || !isPassword){
            return res.status(400).json({error:"Username or Password wrong"})
        }
        generateTokenAndSetCookie(user._id,res);

        res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            username:user.username,
            profileImg:user.profileImg,
            coverImg:user.coverImg,
            bio:user.bio,
            link:user.link,
        })
    }catch(error){
        console.log("Error in Login controller",error);
        res.status(500).json({error:"Internal Server Error:"})
    }
};

export const logout = async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({error:"LoggedOut Successfully"})
    } catch (error) {
        console.log("Error in Logout controller",error);
        res.status(500).json({error:"Internal Server Error:"})
    }
};

export const authCheck = async (req,res)=>{
    try {
        //console.log(req.user._id);
        const user = await User.findById(req.user._id).select("-password")
        return res.status(200).json(user)
    } catch (error) {
        console.log("Error in authCheck Controller",error.message);
        res.status(500).json({error:"Internal Server Error:"})
    }
}