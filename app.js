const express = require('express');
const nodemailer = require('nodemailer');
const app = new express();
// const MongoDBSession = require('connect-mongodb-session')(session);
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const MongoURI = "mongodb+srv://admin:12345@diwali-application.gzyid.mongodb.net/Diwali-Application?retryWrites=true&w=majority"


const UserData = require('./src/model/Users');
mongoose.connect(MongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then((res) => {
    console.log("MongoDB Connected");
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.set('view engine','ejs'); 
app.set('views','./src/views');

app.get('/',(req,res)=>{
    
    res.render('main',
    {
        title: "HAPPY DIWALI",
        
    });
 
});

app.post('/welcome',(req,res)=>{
    let name = req.body.name;
    res.render('welcomePg',
    {
        title:"DIWALI WISHES HERE",
        name:name
    });
});

app.post('/wishes',async(req,res)=>{
    const name = req.body.urName;
    const frndName = req.body.frndName;
    const frndEmail = req.body.frndEmail;

    let testAccount = await nodemailer.createTestAccount();
    const output = `
    <p>You have a Diwali Greeting</p>
    
    
    `;
    var mailOptions = {
        from:'"Diwali Greetings" <kunjimouse@gmail.com>',
        to: frndEmail,
        subject:'HAPPY DIWALI GREETING MAIL',
        text:"Happy Diwali!",
        html:output
    };

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port:587,
        secure:false,
        auth:{
            user:testAccount.user,
            pass:testAccount.pass
        },
    });
    
    transporter.sendMail(mailOptions,function(err,info){
        if(err){
            return console.log(err);
        }
        else{
            // res.send('Email sent: '+info.response);
            console.log("Message sent: %s",info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            let user = new UserData({
                name,
                frndName,
                frndEmail
            });
             user.save();
            res.render('wishes',
            {
                title:"Greetings For Your Friend!",
                name:name,
                frndName:frndName,
                frndEmail:frndEmail,
                success:'Wishes Reached'
            });
        }
        
    });
    

    
});

app.listen(port,()=>{console.log("Server ready at port "+port);});