"use server";

import { signUpSchema } from "@/lib/formSchemas";
import { db } from "@/server/db";
import { createServerAction } from "zsa";
import { AuthError } from "./types";
import { hash } from "@node-rs/argon2";
import { generateId } from "lucia";
import { emailVerificationTable, userTable } from "@/server/db/schema";
import { env } from "@/env";
import jwt from "jsonwebtoken";

const JWT_TOKEN_EXPIRATION_TIME = "10m";
/**
 * Generates a unique code that is a combination of the current timestamp and a random number.
 * The result is a 18 character long string, where the first 12 characters are the timestamp and the last 6 characters are the random number.
 */
const generateUniqueCode = () =>
  Date.now().toString(36) +
  Math.random().toString(36).substring(2, 12).padStart(12, "");

export const signUp = createServerAction()
  .input(signUpSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;

    // Check if email already exists
    const userQuery = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (userQuery) {
      throw AuthError.EMAIL_USED;
    }

    // Generate password hash
    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateId(32);

    // Insert new user
    await db.insert(userTable).values({
      id: userId,
      email,
      hashedPassword,
      createdAt: new Date(),
    });

    // Generate email code
    const code = generateUniqueCode();

    await db.insert(emailVerificationTable).values({
      id: generateId(32),
      code,
      userId,
      createdAt: new Date(),
    });

    const token = jwt.sign({ email, code, userId }, env.JWT_SECRET, {
      expiresIn: JWT_TOKEN_EXPIRATION_TIME,
    });

    const url = `http://localhost:3000/api/verify-email?token=${token}`;

    // await sendConfirmationEmail(email, url);

    return {
      code,
    };
  });
