

const jwt = require("../utils/jwtHelper");
const {jwtDecode} = require("jwt-decode");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "UNAUTHORIZED",
      message: "Access token is missing or invalid"
    });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decodedToken = jwtDecode(token);
    req.user = { userId: decodedToken.userId, role: decodedToken.role };
    next();
  } catch (error) {
    return res.status(403).json({
      status: "FORBIDDEN",
      message: "Token verification failed"
    });
  }
};


// exports.authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   console.log(token,"token",SECRET_KEY)
//   if (!token) {
//     return res.status(401).json({
//       status: "UNAUTHORIZED",
//       message: "Authorization token is missing.",
//       data: null,
//     });
//   }

//   try {
//     const decoded = jwt.verify(token,SECRET_KEY);
//     console.log(decoded,"decoded")
//     req.user = {
//       userId: decoded.userId,
//       role: decoded.role,
//     };
//     next();
//   } catch (err) {
    
//     return res.status(401).json({
//       status: "UNAUTHORIZED",
//       message: "Invalid or expired token.",
//       data: err,
//     });
//   }
// };