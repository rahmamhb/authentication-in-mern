const nodemailer = require("nodemailer")

module.exports = async(email , subject , text)=>{
    try{
        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            service:"Gmail" ,
            port:465 ,
            secure:true,
            auth:{
                authMethod: 'PLAIN',
                user:"mihoubrahma@gmail.com",
                pass:"Replace you email pass here"
            }
        });

        await transporter.sendMail({
            from:"mihoubrahma@gmail.com",
            to:email,
            subject:subject,
            text:text
        })
        console.log("Email sent Successfully")
    }catch(error){
        console.log("Email not sent ")
        console.log(error)
    }
}