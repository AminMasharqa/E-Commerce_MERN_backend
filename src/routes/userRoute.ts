import express, { request, response }  from "express";
import { login, register } from "../services/userService.ts";

const router = express.Router();

router.post('/register', async (request,response)=>{
    try {
        const {firstName,lastName,email,password} = request.body;
        const {statusCode,data} = await register({firstName,lastName,email,password }); 
        response.status(statusCode).send(data);
    } catch (error) {
        console.error('Error in register route:', error);
        response.status(500).send('Registration failed');
    }
})

router.post('/login', async (request,response)=>{
    try {
        const {email, password} = request.body;
        const {statusCode, data} = await login({email,password});
        response.status(statusCode).send(data);
    } catch (error) {
        console.error('Error in login route:', error);
        response.status(500).send('Login failed');
    }
})

export default router;
