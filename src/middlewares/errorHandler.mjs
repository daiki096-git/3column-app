import { validationResult } from "express-validator";
//エラーハンドリング
export const requestErrorHandler = (controller) => {
    return async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message:errors.array()[0].msg,errors: errors.array() });
        }    
        try {
            await controller(req, res)
        } catch (error) {
            next(error);
        }
    }
}