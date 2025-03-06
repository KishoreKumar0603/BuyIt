import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import sendMail from "../middleware/sendMail.js";

dotenv.config();

// Register User

// export const registerUser = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { name, email, phone, password } = req.body;

//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate OTP
//     const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

//     // Create JWT activation token (valid for 5 minutes)
//     const activationKey = jwt.sign(
//       { name, email, phone, hashedPassword, otp },
//       process.env.ACTIVATION_KEY,
//       { expiresIn: "5m" }
//     );

//     // Send OTP via email
//     const message = `Please verify your account to continue. Your OTP is: ${otp}`;
//     await sendMail(email, "Welcome to BuyIt", message);

//     return res.status(200).json({
//       message: "OTP sent to your email",
//       activationKey,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error. Please try again." });
//   }
// };

export const registerUser = async (req, res) => {
  try {
    console.log("Received Registration Data:", req.body);

    const { name, email, phone, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

    // Create JWT activation token (valid for 5 minutes)
    const activationKey = jwt.sign(
      { name, email, phone, hashedPassword, otp },
      process.env.ACTIVATION_KEY,
      { expiresIn: "5m" }
    );

    // Send OTP via email
    const message = `Please verify your account to continue. Your OTP is: ${otp}`;
    await sendMail(email, "Welcome to BuyIt", message);

    // Send activationKey in response (frontend will store it in localStorage)
    return res.status(200).json({
      message: "OTP sent to your email",
      activationKey, // Frontend will store this
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};


//verify otp
// export const verifyUser = async (req,res) =>{
//   try{

//     const {otp,activationKey} = req.body;
//     const verify = jwt.verify(activationKey,process.env.ACTIVATION_KEY);
//     if(!verify){
//       return res.json({
//         message : "OTP  Expired...",
//       });
//     }

//     if(verify.otp !== otp){
//       return res.json({
//         message: "Wrong Otp...",
//       });
//     }

//     await User.create({
//       name:verify.user.name,
//       email:verify.user.email,
//       password:verify.user.hashedPassword,
//       phone:verify.user.phone,
//     });

//     return res.status(200).json({
//       message:"Account Created Succesfully",
//     });

//   }catch(error){
//     return res.status(500).json({
//       message:error.message,
//     });
//   }
// }
export const verifyUser = async (req, res) => {
  try {
    console.log("Received OTP Verification Data:", req.body);

    const { otp, activationKey } = req.body; // Frontend retrieves activationKey from localStorage

    if (!activationKey) {
      return res.status(400).json({ message: "Activation Key is missing. Please register again." });
    }

    // Verify JWT
    const decoded = jwt.verify(activationKey, process.env.ACTIVATION_KEY);
    console.log("Decoded JWT Data:", decoded); // Debugging

    if (!decoded) {
      return res.status(400).json({ message: "OTP Expired..." });
    }

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Wrong OTP..." });
    }

    // Create new user
    await User.create({
      name: decoded.name,
      email: decoded.email,
      password: decoded.hashedPassword,
      phone: decoded.phone,
    });

    return res.status(200).json({ message: "Account Created Successfully" });
  } catch (error) {
    console.error("Error in verifyUser:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};


//Login User
// export const loginUser =  async (req,res) =>{
//   try{
//     const{email , password} = req.body;

//     //Check user email address
    
//     const user = await User.findOne({email});
//     if(!user){
//       return res.json({
//         message : "Invalid email or password",
//       });
//     }
//     //Generate
//     const token = jwt.sign({_id:user.id},process.env.JWT_SECRET, {expiresIn: "15d"});
//     const {password : userPassword, ...userDetails} = user.toObject();
//     if (await user.matchPassword(password)) {
//       res.json({
//         message:"Welcome "+user.name,
//         user : userDetails,
//         token,
//       });
//     } else {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//   }catch(error){
//     return res.json({
//       message:error.message,
//     });
//   }
// }
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email); // Debugging log

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found"); // Debugging log
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    if (!(await user.matchPassword(password))) {
      console.log("Password mismatch"); // Debugging log
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: "15d" });

    console.log("Login successful for:", user.email);
    const { password: userPassword, ...userDetails } = user.toObject();

    res.status(200).json({
      message: "Welcome " + user.name,
      user: userDetails,
      token,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};



//Profile View
export const myProfile = async (req,res) =>{
  try{
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({
      user,
    });
  }catch(error){
    return res.json({
      message: "error : "+error.message,
    });
  }
}
