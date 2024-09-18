import userModel from "../modules/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/userHelper.js";
import JWT from "jsonwebtoken";

export const userRegisterController = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name) {
      return res.status(500).send({ message: "Name is required" });
    }
    if (!email) {
      return res.status(500).send({ message: "Name is required" });
    }
    if (!password) {
      return res.status(500).send({ message: "Name is required" });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      pic,
    });
    res.status(200).send({
      success: true,
      message: "Succesfully registered",
      user,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      message: "Error while register the user",
      error,
    });
  }
};

export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ success: false, message: "Password is required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Email is not registerd",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while register the user",
      error,
    });
  }
};

export const getUsersOnQueryController = async (req, res) => {
  try {
    const keyword = req.query.search;
    console.log(keyword);
    const users = await userModel
      .find({
        $or: [
          {
            name: { $regex: keyword, $options: "i" },
          },
          { email: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-password");

    res.status(200).send({
      success: true,
      message: "Successfully get users",
      users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting all users",
      error,
    });
  }
};
