import express from "express";
import { login, register } from "../services/userService.ts";

const router = express.Router();

router.post('/register', async (request, response) => {
  try {
    console.log('\n=== REGISTER ROUTE HIT ===');
    console.log('Headers:', request.headers);
    console.log('Raw body:', request.body);
    console.log('Body type:', typeof request.body);
    console.log('Body keys:', Object.keys(request.body));
    
    const { firstName, lastName, email, password } = request.body;
    
    console.log('Extracted values:');
    console.log('  - firstName:', firstName, '(type:', typeof firstName, ')');
    console.log('  - lastName:', lastName, '(type:', typeof lastName, ')');
    console.log('  - email:', email, '(type:', typeof email, ')');
    console.log('  - password:', password ? '***' : 'undefined', '(type:', typeof password, ')');
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      console.log('❌ Missing required fields!');
      return response.status(400).json({ 
        success: false,
        message: 'All fields are required',
        received: {
          firstName: !!firstName,
          lastName: !!lastName,
          email: !!email,
          password: !!password
        }
      });
    }
    
    console.log('✓ All fields present, calling register service...');
    
    const { statusCode, data } = await register({ firstName, lastName, email, password });
    
    console.log('Service response:', { statusCode, data: typeof data === 'string' ? data : '(JWT token)' });
    console.log('=== END REGISTER ROUTE ===\n');
    
    response.status(statusCode).json({ 
      success: statusCode === 200,
      data 
    });
    
  } catch (error) {
    console.error('❌ Error in register route:', error);
    response.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    const { statusCode, data } = await login({ email, password });
    
    response.status(statusCode).json({ 
      success: statusCode === 200,
      data 
    });
  } catch (error) {
    console.error('Error in login route:', error);
    response.status(500).json({ 
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;