const { Users } = require("../models/userSchema");
const bcrypt = require("bcrypt");

function escapeRegex(searchKey) {
  return searchKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getAllUsers(search) {
  try {
    let allUsers;
    if (search) {
      let regexEscaped = escapeRegex(search);
      allUsers = await Users.find({
        username: { $regex: regexEscaped, $options: "i" },
      }).sort({ createdAt: -1 });
    } else {
      allUsers = await Users.find({}).sort({ createdAt: -1 });
    }
    return allUsers;
  } catch (err) {
    throw new Error(err);
  }
}

async function editDbUser(_id,userData) {
  try {
    let { username, email, password, isAdmin } = userData;

    let user = await Users.findOne({ _id: _id });

    if (user) {
      user.username = username;
      user.email = email;
      user.isAdmin = isAdmin == "true" ? true : false;

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }


      await user.save();
      return user;
    } else {
      throw new Error("user not found");
    }
  } catch (err) {
    throw new Error("error occureed" + err);
  }
}


async function deleteDbUser (userId) {

    try{

        await Users.deleteOne({ _id: userId });

        return true;

    }catch(err){
        throw new Error('error occured'+err)
    }

}

module.exports = { getAllUsers, escapeRegex, editDbUser, deleteDbUser };
