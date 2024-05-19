const fs=require('fs');
const path = require('path');
const csv = require('csv-parser');
const userModel = require('../Schema/userSchema');
const customModel = require('../Schema/customSchema');
const listModel = require('../Schema/ListSchema');

const uploading = async (req, res) => {
    let userExists = false;
    try {
        const { listTitle } = req.body;
        if (!listTitle) {
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

        const dataStream = fs.createReadStream(filePath)
            .pipe(stripBomStream())
            .pipe(csv())
            .on('data', async (row) => {
                try {
                    const key = Object.keys(row);
                    const values = Object.values(row);

                    const userFind = await userModel.findOne({ email: row.email });

                    if (userFind) {
                        userExists = true;
                        dataStream.destroy(); // Stop further processing
                        fs.unlinkSync(filePath); // Delete the file
                        return;
                    }

                    const userDetail = await userModel.create({
                        name: row.name,
                        email: row.email
                    });

                    const list = await listModel.findOneAndUpdate({ title: listTitle }, { $push: { customProperties: userDetail._id } });
                    await list.save();

                    let i = 2;
                    const customPromises = [];

                    while (i < key.length) {
                        const customAdded = await customModel.create({
                            title: key[i],
                            defaultValue: values[i]
                        });

                        const user = await userModel.findOneAndUpdate({ email: row.email }, { $push: { customProperty: customAdded._id } });
                        customPromises.push(user.save());
                        i++;
                    }

                    await Promise.all(customPromises);

                } catch (error) {
                    console.error("Error in data processing", error.stack);
                    throw error;
                }
            })
            .on('end', async () => {
                if (userExists) {
                    return res.status(400).send('User already exists');
                }
                fs.unlinkSync(filePath);
                return res.send("User has been uploaded successfully");
            })
            .on('error', (error) => {
                console.error("Error in data stream", error.stack);
                return res.status(500).json({ error: error.message });
            });

    } catch (err) {
        console.error("Main error", err.stack);
        return res.status(500).send('something went wrong');
    }
}




module.exports={
    uploading
}