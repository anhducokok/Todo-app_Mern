import userService from "../services/userService.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const result = await userService.registerUser({ username, email, password });
    
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in register controller:", error);
    
    // Handle validation errors vs system errors
    if (error.message.includes("đã tồn tại") || 
        error.message.includes("ít nhất") || 
        error.message.includes("không hợp lệ")) {
      return res.status(400).json({ message: error.message.replace("Registration failed: ", "") });
    }
    
    res.status(500).json({ 
      message: "Lỗi hệ thống khi đăng ký" 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await userService.loginUser({ email, password });
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in login controller:", error);
    
    // Handle authentication errors vs system errors
    if (error.message.includes("không chính xác") || 
        error.message.includes("bắt buộc")) {
      return res.status(401).json({ message: error.message.replace("Login failed: ", "") });
    }
    
    res.status(500).json({ 
      message: "Lỗi hệ thống khi đăng nhập" 
    });
  }
};

export const logout = (req, res) => {
  // JWT is stateless, so logout is handled on client side
  res.status(200).json({ 
    message: "Đăng xuất thành công" 
  });
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    const user = await userService.getUserProfile(userId);
    
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getProfile controller:", error);
    
    if (error.message.includes("Không tìm thấy")) {
      return res.status(404).json({ message: error.message.replace("Failed to get profile: ", "") });
    }
    
    res.status(500).json({ 
      message: "Lỗi hệ thống khi lấy thông tin" 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { username, email } = req.body;
    
    const result = await userService.updateUserProfile(userId, { username, email });
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    
    if (error.message.includes("Không tìm thấy")) {
      return res.status(404).json({ message: error.message.replace("Failed to update profile: ", "") });
    }
    
    if (error.message.includes("ít nhất") || 
        error.message.includes("không hợp lệ")) {
      return res.status(400).json({ message: error.message.replace("Failed to update profile: ", "") });
    }
    
    res.status(500).json({ 
      message: "Lỗi hệ thống khi cập nhật thông tin" 
    });
  }
};