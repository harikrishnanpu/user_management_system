const express = require('express');
const { showHomePage, showUserSignUpPage, CreateUserAccount, LoginUserAccount, logoutAccount, showUserLoginPage, updateUserPassword, getCheckUserFormPage, getUpdatePasswordFormPage, checkUserExists } = require('../controllers/UserController');
const { checkIsUserLoggedIn, redirectIfUserLoggedIn } = require('../middlewares/authMiddleware');



const userRouter = express.Router();


userRouter.get('/',checkIsUserLoggedIn,showHomePage);

userRouter.get('/login' ,redirectIfUserLoggedIn, showUserLoginPage);

userRouter.post('/login',redirectIfUserLoggedIn, LoginUserAccount);

userRouter.get('/signup',redirectIfUserLoggedIn, showUserSignUpPage);

userRouter.post('/signup',redirectIfUserLoggedIn, CreateUserAccount);

userRouter.get('/user/check',getCheckUserFormPage);

userRouter.get('/user/:id/update/password', getUpdatePasswordFormPage);

userRouter.post('/user/:id/update/password', updateUserPassword);

userRouter.post('/user/check',checkUserExists);

userRouter.get('/logout', logoutAccount);




module.exports = userRouter;