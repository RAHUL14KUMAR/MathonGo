const listModal=require('../Schema/ListSchema');

// addmin can createList
const createList=async(req,res)=>{
    const { listTitle }=req.body;

    if(!listTitle){
        return res.status(400).json({message:'title is required'})
    }

    const list=await listModal.create({
        title:listTitle
    })

    return res.status(200).json({message:'list is created successfully'})
}

module.exports={
    createList
}