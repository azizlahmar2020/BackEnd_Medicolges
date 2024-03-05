const validateMW=(DataSchema)=> async(req,res,next)=>{
    const data = req.body;
    try {
       await DataSchema.validate(data);
        next();
    } catch (error) {
        console.log(error);
         res.status(400).json({message:error.message});
    }
};

module.exports=validateMW;