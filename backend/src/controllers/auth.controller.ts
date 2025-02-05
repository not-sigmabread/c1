import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User.model';
import { UserRole } from '../../../shared/types/user.types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = await User.create({
        username,
        password: hashedPassword,
        role: UserRole.USER,
        isGuest: false,
      });

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.status(201).json({ token, user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async guestLogin(req: Request, res: Response) {
    try {
      const guestUsername = `guest_${Math.random().toString(36).substr(2, 9)}`;
      
      const guest = await User.create({
        username: guestUsername,
        role: UserRole.GUEST,
        isGuest: true,
      });

      const token = jwt.sign(
        { id: guest._id, username: guest.username, role: guest.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.status(200).json({ token, user: guest });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}
