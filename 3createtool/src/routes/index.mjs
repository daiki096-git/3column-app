import express from "express";
import authRoute from "./auth/authRoute.mjs";
import columRoute from "./column/columnRoute.mjs";
import deleteRoute from "./column/deleteRoute.mjs";
import registerRoute from "./column/registerRoute.mjs";
import updateRoute from "./column/updateRoute.mjs";
import searchRoute from "./column/searchRoute.mjs";
import userRoute from "./user/userRoute.mjs";

const router=express.Router();

router.use(authRoute);
router.use(columRoute);
router.use(deleteRoute);
router.use(registerRoute);
router.use(updateRoute);
router.use(searchRoute);
router.use(userRoute);

export default router;
