import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET_KEY) {
      console.error("not jwt secret present");
      return res
        .status(500)
        .json({ message: "server authentication configuration error" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "token is not valid" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access denied: Admin only" });
  }
};

export const isStaff = (req, res, next) => {
  if ((req.user && req.user.role === "staff") || req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access denied: Admin or Staff only" });
  }
};
