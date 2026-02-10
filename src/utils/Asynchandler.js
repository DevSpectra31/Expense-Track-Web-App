//ye ek function hai jo function hi input leta haii
const asyncHandler= (fn)=>(async( req ,res , next)=>{
    try{
        await fn(req ,res,next);
    }catch(error){
        res.status(error.statusCode || 500)
        .json({
            success:false,
            message:error.message
        })
    }
})
export {asyncHandler}