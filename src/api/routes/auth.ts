import { signupSchema } from '../schemas/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { generateIdFromEntropySize } from '../utils/ids';
import { JWT_SECRET } from '../config';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const router = express.Router();

// Signup endpoint
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = signupSchema.parse(req.body);
    
    // Check if username already exists
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return res.status(400).json({ error: "Email already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate user ID
    const userId = generateIdFromEntropySize(10);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash: hashedPassword,
      },
    });

    // Create session
    const sessionId = generateIdFromEntropySize(10);
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        sessionId
      }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    );

    // Return user data and token
    return res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      sessionToken: token
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

export default router;