const { createUser, getUserbyId, getUser, updateDbUserPassword } = require("../helpers/userHelper");
const { Users } = require("../models/userSchema");
const bcrypt = require("bcrypt");

async function CreateUserAccount(req, res) {
  try {
    let user = req.body;

    if (!user) {
      throw new Error("User Not Found");
    }

    let createdUser = await createUser(user);

    if (createdUser) {
      req.session.user = {
        username: createdUser.username,
        email: createdUser.email,
        _id: createdUser._id,
      };
      res.redirect("/");
    }
  } catch (err) {
    res.render("signup", { error: err });
  }
}

async function LoginUserAccount(req, res) {
  try {
    let user = req.body;

    if (!user) {
      throw new Error("User Not Found");
    }

    let dbUser = await Users.findOne({ email: user.email });

    if (dbUser) {
      let checkPassword = await bcrypt.compare(user.password, dbUser.password);
      if (checkPassword) {
        req.session.user = {
          username: dbUser.username,
          email: dbUser.email,
          _id: dbUser._id,
        };
        res.redirect("/");
      } else {
        throw new Error("Password not matched!");
      }
    } else {
      throw new Error("User Not Exists!");
    }
  } catch (err) {
    res.render("login", { error: err });
  }
}

async function showHomePage(req, res) {
  try {
    res.render("home", { user: req.session.user, error: null });
  } catch (err) {
    res.send("error occured");
  }
}

async function showUserLoginPage(req, res) {
  try {
    res.render("login", { error: null });
  } catch (err) {
    res.send("error");
  }
}

async function showUserSignUpPage(req, res) {
  try {
    res.render("signup", { error: null });
  } catch (err) {
    res.send("error occured");
  }
}

async function logoutAccount(req, res) {
  if (req.session.user) {
    req.session.user = null;
    if (!req.session.admin) {
      res.clearCookie("haha.sid");
    }
    res.redirect("/login");
  } else {
    res.send("Error Occured: Session Not Found");
  }
}

async function getCheckUserFormPage (req,res) {

  try{

    res.render('check-user',{message: null, error: null});

  }catch(err){
    res.send('errro occured')
  }

}

async function getUpdatePasswordFormPage (req,res){

  try{

    let user = await getUserbyId(req.params.id);

    res.render('forgotten-password',{ message: null, error: null, userId: user._id })

  }catch(err){
    res.send("error occured")
  }

}


async function updateUserPassword (req,res) {

  try{

    let passwordData = req.body;
    let userId = req.params.id;

    if(!passwordData || passwordData.password !== passwordData.confirmpassword){

      res.render('forgotten-password', { error: 'password not match',  message: null, userId })

    }else{

      let updatedUser = await updateDbUserPassword(userId,passwordData.password);

      if(updatedUser){
        res.render('forgotten-password', { error: null , message: 'successfully updated password!', userId })
      }else{
        res.render('forgotten-password', { error: 'error occured',  message: null, userId })
      }

    }

  }catch(err){
    res.render('forgotten-password', { error: err , message: null})
  }

}


async function checkUserExists (req,res) {

  try{

    let userData = req.body;

    if(!userData){
      throw new Error('user not found');
    }


    let dbUser = await getUser(userData);

    if(dbUser){

      res.send(`
        <style>
        body{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 90vh;
        }
        </style>

        <div>
        <h1>User Found</h1>
        <a href="/user/${dbUser._id}/update/password">Click this to reset your password </a>
        </div>
        
      `)

    }else{
      throw new Error('user not found');
    }

  }catch(err){
    res.render('check-user',{ error: err,message: null })
  }


}

module.exports = {
  CreateUserAccount,
  LoginUserAccount,
  showHomePage,
  showUserLoginPage,
  showUserSignUpPage,
  logoutAccount,
  updateUserPassword,
  getCheckUserFormPage,
  getUpdatePasswordFormPage,
  checkUserExists,
  updateUserPassword
};
