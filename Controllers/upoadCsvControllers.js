const fs=require('fs');
const path = require('path');
const csv = require('csv-parser');
const userModel = require('../Schema/userSchema');
const customModel = require('../Schema/customSchema');
const listModel = require('../Schema/ListSchema');

const uploading=async (req, res) => {
    try{ 
        const {listTitle}=req.body;
        if(!listTitle){
            res.status(400);
            throw new Error('listTitle is required');
        }

        if (!req.file) {
            res.status(400);
            throw new Error('Please upload a file');
        }
        
        const filePath = path.join('uploads', req.file.filename);
        
        let stripBomStream;
        try {
            stripBomStream = (await import('strip-bom-stream')).default;
        } catch (error) {
            return res.status(500).send('Error loading strip-bom-stream.');
        }
        
        let i=2;

        fs.createReadStream(filePath)
        .pipe(stripBomStream())
        .pipe(csv())
        .on('data', async(row) => {

            const key= Object.keys(row);
            const values= Object.values(row);

            const userFind=await userModel.findOne({email:row.email});

            if(userFind){
                return;
            }

            const userDetail=await userModel.create({
                name:row.name,
                email:row.email
            });

            const list=await listModel.findOneAndUpdate({title:listTitle},{$push:{customProperties:userDetail._id}})
            await list.save();
            
            
            while(i<key.length){

                const customAdded=await customModel.create({
                    title:key[i],
                    defaultValue:values[i]
                });

                const user=await userModel.findOneAndUpdate({email:row.email},{$push:{customProperty:customAdded._id}})
                await user.save();
                i++;
            }
            i=2;
        })
        .on('end', () => {
            fs.unlinkSync(filePath);
            return res.status(200).send("user has been uploaded successfully");
        })

    }catch(err){
        return res.status(500).send("some thing went weong");
    }
}

module.exports={
    uploading
}