import { Router } from "express";
import {register,login} from "../controller/user.controller.js"

const router = Router();

router.get("/",(req,res)=> {
    res.render("index.ejs")
});

export default router;