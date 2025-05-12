const { Users } = require("../models/userSchema");
const bcrypt = require('bcrypt');



async function createUser (userData) {

    try{

        let alreadyLoggedIn = await Users.findOne({ email: userData.email })

        if(alreadyLoggedIn){
            throw new Error("User Already Exists!")
        }else{

            let hashedPassword = await bcrypt.hash(userData.password,10);

            let newUser = new Users({
                email: userData.email,
                username: userData.username,
                password: hashedPassword,
                isAdmin: userData.isAdmin == "true" ? true : false
            })

            await newUser.save();

            return newUser;

        }

    }catch(err){
        throw new Error('error occured '+ err)
    }

}


async function getUserbyId (userData) {

    try{

        let user = await Users.findOne({ _id: userData });

        return user;

    }catch(err){
        throw new Error("error ocured" + err)
    }

}

async function  getUser(userData) {
    try{

        let user = await Users.findOne({ email: userData.email });

        if(user){

           if( user.username == userData.username){
            return user;
           }else{
            throw new Error('username not matched!')
           }

        }

    }catch(err){
        throw new Error('error occured'+err)
    }
}

async function updateDbUserPassword (userId,password) {

    try{

        let user = await Users.findOne({ _id: userId  });

        if(!user){
            throw new Error('user not found!')
        }

        let hashedPassword = await bcrypt.hash(password,10);

        if(hashedPassword){
            user.password = hashedPassword;
        }

        await user.save();

        return user;

    }catch(err){

        throw new Error('error occured'+err)

    }

}


module.exports = { createUser, getUserbyId, getUser, updateDbUserPassword };