import jwt from "jsonwebtoken";
const isAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    console.log(token);

    console.log(token);
    console.log(req.cookies);
console.log("token =", token);
console.log(typeof token);
    if (!token) {
      return res.status(401).json({ message: "user token not found" });
    }
    let verifytoken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verifytoken);

    req.userId = verifytoken.userId;
    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: error.message,
    });
  }
};
export default isAuth;
