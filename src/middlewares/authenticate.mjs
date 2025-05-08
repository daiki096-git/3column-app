export const authenticate=(req,res,next)=>{
    if(!req.session.userid)return res.status(401).json({ message: '認証されていません。ログインが必要です。'})
    next()
}