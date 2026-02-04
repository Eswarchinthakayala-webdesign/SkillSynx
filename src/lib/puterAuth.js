import { puter } from '@heyputer/puter.js';

// Basic utility to simulate secure password hashing (for demo purposes in browser)
// In a real production app, you'd want more robust handling or server-side hashing.
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// User Storage Keys
const USERS_PREFIX = 'skillsynx_user_';
const SESSION_KEY = 'skillsynx_session';

export const puterAuth = {
    // Sign Up: Create a new user in Puter KV
    async signUp(email, password, fullName) {
        try {
            // Check if user exists
            const existingUser = await puter.kv.get(`${USERS_PREFIX}${email}`);
            if (existingUser) {
                throw new Error("User already exists with this email.");
            }

            const hashedPassword = await hashPassword(password);
            const user = {
                id: crypto.randomUUID(),
                email,
                fullName,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };

            // Store user
            await puter.kv.set(`${USERS_PREFIX}${email}`, user);
            
            // Return user without password
            const { password: _, ...safeUser } = user;
            return safeUser;
        } catch (error) {
            console.error("SignUp Error:", error);
            throw error;
        }
    },

    // Login: Verify credentials
    async login(email, password) {
        try {
            const user = await puter.kv.get(`${USERS_PREFIX}${email}`);
            
            if (!user) {
                throw new Error("Invalid email or password.");
            }

            const hashedPassword = await hashPassword(password);
            if (user.password !== hashedPassword) {
                throw new Error("Invalid email or password.");
            }

            // Create simple session
            const { password: _, ...safeUser } = user;
            
            // Persist session in Puter KV (optional for multi-device, but good for persistence)
            // For this demo, we'll store local session state in the Context, 
            // but we can also use KV to track active sessions if needed.
            // Here, we just return the user.
            
            return safeUser;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    },

    // Get Session (Persistence)
    // We will use localStorage for the session token/email to re-fetch from Puter
    // Alternatively, Puter logic could be used if we were using puter.auth, 
    // but since we are doing custom auth on top of KV:
    async getCurrentUser() {
        try {
            const sessionEmail = localStorage.getItem(SESSION_KEY);
            if (!sessionEmail) return null;

            const user = await puter.kv.get(`${USERS_PREFIX}${sessionEmail}`);
            if (!user) {
                localStorage.removeItem(SESSION_KEY);
                return null;
            }
            
            const { password: _, ...safeUser } = user;
            return safeUser;
        } catch (error) {
            return null;
        }
    },

    async logout() {
        localStorage.removeItem(SESSION_KEY);
    },

    persistSession(email) {
        localStorage.setItem(SESSION_KEY, email);
    }
};
