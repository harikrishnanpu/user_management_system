const { AdminData } = require("../data/admin");
const {
  getAllUsers,
  editDbUser,
  deleteDbUser,
} = require("../helpers/adminHelper");
const { createUser, getUserbyId } = require("../helpers/userHelper");
const { Users } = require("../models/userSchema");
const bcrypt = require("bcrypt");


async function AdminLogin(req, res) {
  try {
    let admin = req.body;

    if (!admin) {
      throw new Error("User Not Found");
    }

    let dbAdmin = await Users.findOne({ email: admin.email });

    if (dbAdmin && dbAdmin.isAdmin) {
      let checkPassword = await bcrypt.compare(
        admin.password,
        dbAdmin.password
      );
      if (checkPassword) {
        if (dbAdmin) {
          req.session.admin = {
            username: dbAdmin.username,
            email: dbAdmin.email,
            _id: dbAdmin._id,
          };
          res.redirect("/admin/dashboard");
        }
      } else {
        throw new Error("Password not matched!");
      }
    } else {
      throw new Error("Admin Not Exists!");
    }
  } catch (err) {
    res.render("admin/login", { error: err });
  }
}

async function CreateAdminAccount(req, res) {
  try {
    let admin = AdminData;
    await Users.findOneAndDelete({ email: "admin@admin.com" });

    let dbAdmin = await Users.findOne({ email: admin.email });

    if (dbAdmin) {
      throw new Error("Admin Account Aleready Exists!");
    } else {
      let hashedPassword = await bcrypt.hash(admin.password, 10);

      let createdAdmin = new Users({
        username: admin.username,
        email: admin.email,
        password: hashedPassword,
        isAdmin: admin.isAdmin,
      });

      await createdAdmin.save();

      res.send(`
                Admin Account Created Successfully!
                <a href="/admin/login">Go To Login Page</a>
                `);
    }
  } catch (err) {
    res.send("Error Occured" + err);
  }
}

async function showDashboard(req, res) {
  try {
    let { search } = req.query;
    let allUsers;
    if (search) {
      allUsers = await getAllUsers(search);
      res.render("admin/dashboard", {
        users: allUsers,
        error: null,
        admin: req.session.admin,
        message: null
      });
    } else {
      allUsers = await getAllUsers();
      res.render("admin/dashboard", {
        users: allUsers,
        error: null,
        admin: req.session.admin,
        message: null
      });
    }
  } catch (err) {
    res.render("admin/dashboard", { error: err, users: null, user: null, message: null });
  }
}

async function showLoginPage(req, res) {
  try {
    res.render("admin/login", { error: null });
  } catch (err) {
    res.send("Error Occured");
  }
}

async function logoutAdminAccount(req, res) {
  try {
    if (req.session.admin) {
      req.session.admin = null;
      if (!req.session.user) {
        res.clearCookie("haha.sid");
      }
      res.redirect("/admin/login");
    }
  } catch (err) {
    res.send("Error" + err);
  }
}

async function getAddUserPage(req, res) {
  try {
    res.render("admin/createUser", { message: null, error: null });
  } catch (err) {
    res.send("error occured");
  }
}

async function addUser(req, res) {
  try {
    let userData = req.body;

    if (!userData) {
      throw new Error("user data not found!");
    }

    let createdUser = await createUser(userData);

    if (createdUser) {
      res.render("admin/createUser", {
        message: "Successfully Created User",
        error: null,
      });
    }
  } catch (err) {
    res.render("admin/createUser", { error: err, message: null });
  }
}

async function getEditUserPage(req, res) {
  try {
    let user_id = req.params.id;
    let user = await getUserbyId(user_id);

    if (user) {
      res.render("admin/editUser", { user, message: null, error: null });
    } else {
      res.render("admin/editUser", {
        message: null,
        error: "user not found",
        user: null,
      });
    }
  } catch (err) {
    res.render("admin/editUser", { message: null, error: err, user: null });
  }
}

async function editUser(req, res) {
  try {
    let userDetails = req.body;
    let user_id = req.params.id;

    if (userDetails.username.trim() == "" || userDetails.email.trim() == "" || !userDetails || !user_id) {
      throw new Error("all fields are required");
    }

    let editedUser = await editDbUser(user_id, userDetails);

    if (editedUser) {
      res.render("admin/editUser", {
        message: "successfully updated",
        error: null,
        user: editedUser,
      });
    } else {
      res.render("admin/editUser", {
        message: null,
        error: "error occured! retry again",
        user: userDetails,
      });
    }
  } catch (err) {
    let userDetails = await getUserbyId(req.params.id);
    res.render("admin/editUser", { message: null, error: err, user: userDetails });
  }
}

async function deleteUser(req,res) {
  try {

    let userId = req.params.id
    let deleted = await deleteDbUser(userId);
    if (deleted) {
        res.status(200).json({ message: 'successfully deleted' });
    }
  } catch (err) {
        res.status(500).json({ error: err });
  }

}

module.exports = {
  AdminLogin,
  CreateAdminAccount,
  showDashboard,
  showLoginPage,
  logoutAdminAccount,
  addUser,
  getAddUserPage,
  getEditUserPage,
  editUser,
  deleteUser
};
