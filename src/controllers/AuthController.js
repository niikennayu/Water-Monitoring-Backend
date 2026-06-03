import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export class AuthController {

  /**
   * REGISTER
   */
  static async register(req, res) {

    try {

      const { name, email, password } = req.body;

      // Validasi input
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Semua field wajib diisi",
        });
      }

      // Cek email sudah ada atau belum
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email sudah digunakan",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Register berhasil",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

  }

  /**
   * LOGIN
   */
  static async login(req, res) {

    try {

      const { email, password } = req.body;

      // Validasi input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email dan password wajib diisi",
        });
      }

      // Cari user
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      // Compare password
      const isMatch = await bcrypt.compare(
  password,
  user.password
);

      if (!isMatch) {
        const tess = await bcrypt.hash("andi123", 10);
        console.log(tess);
        return res.status(400).json({
          success: false,
          message: "Password salah",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

  }

  /**
   * GET CURRENT USER
   */
  static async getCurrentUser(req, res) {

    try {

      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

  }

  /**
   * LOGOUT
   */
  static async logout(req, res) {

    try {

      return res.status(200).json({
        success: true,
        message: "Logout berhasil",
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });

    }
    
  }

   /**
   * FORGOT PASSWORD
   */
  static async forgotPassword(req, res) {

    try {

      const { email } = req.body;

      // cek user
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Email tidak ditemukan",
        });
      }

      // generate token
      const resetToken =
        crypto.randomBytes(32).toString("hex");

      // simpan token
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          resetToken,
          resetTokenExpiry:
            new Date(Date.now() + 3600000),
        },
      });

      return res.status(200).json({
        success: true,
        message:
          "Link reset password berhasil dikirim",
        token: resetToken,
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

  }
   /**
   * RESET PASSWORD
   */
  static async resetPassword(req, res) {

    try {

      const {
        token,
        password,
      } = req.body;

      // cari user berdasarkan token
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
        },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Token tidak valid",
        });
      }

      // hash password baru
      const hashedPassword =
        await bcrypt.hash(password, 10);

      // update password
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return res.status(200).json({
        success: true,
        message:
          "Password berhasil diubah",
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

  }

}