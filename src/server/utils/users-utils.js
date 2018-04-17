const db = require("../models");
const HttpStatus = require("http-status-codes");
const _ = require("lodash");

const addRoles = async (roles, userId) => {
  const isCurrentRole = role => role.currentRole === true;
  let currentRoleIndex = roles.findIndex(isCurrentRole);
  if (currentRoleIndex === -1) currentRoleIndex = 0;

  await db.UserRole.destroy({ where: { user_id: userId } });

  let index = 0;
  for (const role of roles) {
    await db.UserRole.create({
      user_id: userId,
      tenant_id: role.tenantId,
      role_id: role.roleId,
      current_role: currentRoleIndex === index
    });
    index++;
  }
};

const tenantWeCanAdmin = async (req, next) => {
  //who can the logged in user admin
  const tenantIdList = _.filter(req.user.roles, { roleName: "admin" }).map(o => o.tenantId);
  if (!tenantIdList.length) {
    const err = new Error("Unauthorized");
    err.status = HttpStatus.UNAUTHORIZED;
    return next(err);
  }
  return tenantIdList;
};

const canCreateUsers = async (req, next) => {
  const tenantIdList = await tenantWeCanAdmin(req, next);
  const roles = req.body.roles;

  const canCreate = roles.reduce((acc, role) => {
    if (!acc) return acc;
    return tenantIdList.some(tenantId => tenantId === role.tenantId);
  }, true);

  if (!canCreate) {
    const err = new Error("Unauthorized");
    err.status = HttpStatus.UNAUTHORIZED;
    return next(err);
  }

  return canCreate;
};

const canUpdateUser = async (req, next) => {
  const tenantIdList = await tenantWeCanAdmin(req, next);
  const roles = req.body.roles;

  const canUpdate = roles.reduce((acc, role) => {
    if (!acc) return acc;
    return tenantIdList.includes(role.tenantId);
  }, true);
  if (!canUpdate) {
    const err = new Error("Unauthorized");
    err.status = HttpStatus.UNAUTHORIZED;
    return next(err);
  }

  return canUpdate;
};

module.exports = {
  addRoles,
  tenantWeCanAdmin,
  canCreateUsers,
  canUpdateUser
};
