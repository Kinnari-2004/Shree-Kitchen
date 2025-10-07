// // middleware/auth.js
// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   try {
//     const { token } = req.headers;   // 👈 frontend must send `token` header
//     if (!token) {
//       return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.body.userId = decoded.id;    // 👈 attach userId here
//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };

// export default authMiddleware;


import jwt from "jsonwebtoken" 
const authMiddleware = async (req,res,next) => { 
  const {token} = req.headers; 
  if (!token) { 
    return res.json({success:false,message:"Not Authorized, Login Again."}) 
  } 
  try { 
    const token_decode = jwt.verify(token, process.env.JWT_SECRET); 
    req.body.userId = token_decode.id; 
    next(); 
  } catch (error) { 
    console.log(error); 
    res.json({success:false,message:"API Error"}) 
  } 
} 

export default authMiddleware;

