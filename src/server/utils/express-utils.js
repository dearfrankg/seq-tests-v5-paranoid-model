const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const { setRoles } = require("../controllers/utils/users");

const getToken = async email => {
  let user = await db.User.findOne({
    where: { email },
    include: [
      {
        model: db.UserRole,
        as: "roles",
        attributes: ["user_role_id", "current_role"],
        include: ["tenants", "roles"]
      }
    ]
  });

  user = setRoles(user.toJSON());

  return jwt.sign(user, config.secret);
};

module.exports = {
  getToken
};
