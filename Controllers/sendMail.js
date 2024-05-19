const nodemailer=require('nodemailer');
const listModel=require('../Schema/ListSchema');
const userModel=require('../Schema/userSchema'); 

var transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }   
})

const transportMail=async(data)=>{
    
    let info = await transporter.sendMail({
        from: process.env.EMAIL,
        to:data.email,
        subject:'Hello',
        text:'Hello world',
        html:`<html><body>
        <b>Hello ${data.name}</b>
        <br/>
        <br/>

        <h2>Thank you for signup with your Email ${data.email}</h2>

        <footer>
        <h2>Team Rahul</h2>
        </footer>
        </body></html>`
    })
}
const sendMail=async(data)=>{
    data.map(async(item)=>{
        const users=await userModel.findById(item._id.toString());
        const a={
            name:users.name,
            email:users.email
        }
        transportMail(a);
    })
}

// admin can send email to all the user in a particular list
const sendAllEmail=async(req,res)=>{
    try{
        const {listTitle}=req.body;
        const list=await listModel.findOne({title:listTitle});

        const users=list.customProperties;
        await sendMail(users);

        return res.status(200).send("email is sent successfully")

    }catch(error){
        res.status(500).send("something went wrong")
    }
}

module.exports={
    sendMail,
    sendAllEmail
}