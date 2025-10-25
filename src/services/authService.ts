import { DatabaseService, CreateUserData } from './database';
import { hashPassword, comparePassword } from '../utils/password';
import { LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';

/**
 * Real authentication service using Neon database
 */
export class AuthService {
    /**
     * Register a new user
     * @param credentials - User registration data
     * @returns Authentication response
     */
    static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
        try {
            // Check if user already exists
            const userExists = await DatabaseService.userExists(credentials.email);
            if (userExists) {
                return {
                    success: false,
                    error: 'Email already exists'
                };
            }

            // Hash the password
            const passwordHash = await hashPassword(credentials.password);

            // Create user data
            const userData: CreateUserData = {
                name: credentials.name,
                email: credentials.email,
                password_hash: passwordHash
            };

            // Create user in database
            const user = await DatabaseService.createUser(userData);

            return {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.created_at
                }
            };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                error: 'Failed to create account. Please try again.'
            };
        }
    }

    /**
     * Authenticate a user
     * @param credentials - User login data
     * @returns Authentication response
     */
    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            // Find user by email
            const user = await DatabaseService.findUserByEmail(credentials.email);
            if (!user) {
                return {
                    success: false,
                    error: 'Invalid email or password'
                };
            }

            // Verify password
            const passwordMatch = await comparePassword(credentials.password, user.password_hash);
            if (!passwordMatch) {
                return {
                    success: false,
                    error: 'Invalid email or password'
                };
            }

            // Update last login time
            await DatabaseService.updateLastLogin(user.id);

            return {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.created_at
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Failed to authenticate. Please try again.'
            };
        }
    }

    /**
     * Get user by ID
     * @param userId - User ID
     * @returns User data or null
     */
    static async getUserById(userId: string) {
        try {
            const user = await DatabaseService.getUserById(userId);
            if (!user) {
                return null;
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.created_at
            };
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }
}

