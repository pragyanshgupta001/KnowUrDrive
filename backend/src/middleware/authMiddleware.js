import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) {

    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if(!user.isActive) {
        return res.status(403).json({ message: "Account is deactivated. Contact support." });
      }
      req.user = user;

      next();

    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }

  } else {
    res.status(401).json({ message: "No token" });
  }
};

export default protect;