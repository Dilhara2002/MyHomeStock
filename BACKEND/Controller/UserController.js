import User from "../Model/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Signup a new user

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (password will be hashed by the pre-save hook)
    const user = await User.create({
      name,
      email,
      password, // Pass the plain password
      role: role || "user", // Default role is "user"
    });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Signup Error:", error); // Debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login a user
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log("Login Request:", { email, password }); // Debugging

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("User not found"); // Debugging
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     console.log("User Found:", user); // Debugging

//     // Check if password matches
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("Password Match:", isMatch); // Debugging

//     if (!isMatch) {
//       console.log("Password does not match"); // Debugging
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     res.status(200).json({ token, user });
//   } catch (error) {
//     console.error("Login Error:", error); // Debugging
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role // Make sure role is included in JWT
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Explicitly send role
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, profilePicture }, // ✅ Update profilePicture
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Middleware to authenticate user
export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has expired
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

