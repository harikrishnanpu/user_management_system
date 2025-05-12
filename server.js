const express = require('express');
const path = require('node:path');
const userRouter = require('./routers/userRouter');
const mongoose = require('mongoose');
const session = require('express-session');
const adminRouter = require('./routers/adminRouter');

const app = express();
const PORT = 3000;


mongoose.connect('mongodb://localhost:27017/UserManagement').then(()=>{
    console.log("Mongodb Connected");
}).catch((err)=>{
    console.log(err);
});

app.use(session({
    secret: 'secret',
    name: 'haha.sid',
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}))

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/', userRouter);
app.use('/admin', adminRouter);



app.use((req, res) => {
  res.status(404).send('Page not found');
});


app.use((err,req,res,next)=>{
    if(err){
        res.send("ERRORROROR")
    }
})

app.listen(PORT,()=> console.log(`Server is Listening to Port: ${PORT}`));