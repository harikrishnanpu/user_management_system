const express = require('express');
const { AdminLogin, CreateAdminAccount, showDashboard, showLoginPage, logoutAdminAccount, getAddUserPage, addUser, getEditUserPage, editUser, deleteUser } = require('../controllers/AdminController');
const { checkIsAdminLoggedIn, redirectIfAdminLoggedIn } = require('../middlewares/authMiddleware');

const adminRouter = express.Router();



adminRouter.get('/dashboard',checkIsAdminLoggedIn, showDashboard);

adminRouter.get('/login',redirectIfAdminLoggedIn, showLoginPage);

adminRouter.get('/create',redirectIfAdminLoggedIn, CreateAdminAccount);

adminRouter.post('/login',redirectIfAdminLoggedIn, AdminLogin);

adminRouter.get('/create/user',checkIsAdminLoggedIn, getAddUserPage);

adminRouter.post('/user/create',checkIsAdminLoggedIn, addUser);

adminRouter.get('/user/:id/edit',checkIsAdminLoggedIn, getEditUserPage);

adminRouter.post('/user/:id/edit',checkIsAdminLoggedIn, editUser);

adminRouter.delete('/user/:id/delete',checkIsAdminLoggedIn, deleteUser)


adminRouter.get('/logout', logoutAdminAccount)


module.exports = adminRouter;