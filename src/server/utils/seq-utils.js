"use strict";

const db = require("../models");
const Op = require("sequelize").Op;
const _ = require("lodash");

const seqUtils = {
  /* truncate tables in db */
  async dropTables() {
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;", { raw: true });
    await db.sequelize.sync({ force: true });
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;", { raw: true });
  },

  /* run promises in sequence */
  runPromiseSequence(promiseSequence) {
    return promiseSequence.reduce((sequence, operationPromise) => {
      return sequence.then(() => operationPromise);
    }, Promise.resolve());
  },

  /* create data in sequence */
  createDataInSequence(dataList, create, options) {
    return dataList.reduce((sequence, data) => {
      return sequence.then(() => create(data, options));
    }, Promise.resolve());
  },

  /* create assoc row when missing */
  async createRowWhenMissing(info) {
    const { data, assocProp, assocType, assocKey } = info;

    // get a unique list of assoc records
    let assocRows = [];
    data.forEach(row => {
      row[assocProp].forEach(item => {
        assocRows.push(item);
      });
    });
    assocRows = _.uniq(assocRows);

    // determine neededRows
    const options = {
      where: { [assocKey]: { [Op.in]: assocRows } }
    };
    const existingRows = await db[assocType].findAll(options);
    const neededRows = _.difference(assocRows, existingRows);
    await Promise.all(
      neededRows.map(name => {
        return db[assocType].create({ [assocKey]: name });
      })
    );
  },

  /* create assoc row when missing */
  async assignUserRoles(scenario) {
    const tenants = {};
    const roles = {};
    await db.Tenant.findAll().map(o => (tenants[o.name] = o.tenant_id));
    await db.Role.findAll().map(o => (roles[o.name] = o.role_id));

    for (const userEmail of Object.keys(scenario)) {
      for (const role of scenario[userEmail]) {
        const [tenantName, roleName] = role.split(":");
        const options = { where: { email: userEmail } };
        const user = await db.User.findOne(options);
        await db.UserRole.create({
          user_id: user.user_id,
          role_id: roles[roleName],
          tenant_id: tenants[tenantName]
        });
      }
    }
  }
};

module.exports = seqUtils;
