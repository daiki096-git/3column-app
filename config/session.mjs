import session from "express-session"; 
import dotenv from 'dotenv';

dotenv.config();
const session_middle=session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  export default session_middle;