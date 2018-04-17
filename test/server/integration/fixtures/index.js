"use strict";

const { dump } = require("../../../../src/server/utils");
const db = require("../../../../src/server/models");
const postJSON = require("./posts.json");
const tenantJSON = require("./tenants.json");
const roleJSON = require("./roles.json");
const userJSON = require("./users.json");
const imageJSON = require("./images.json");
const categoryJSON = require("./category.json");
const sponsorJSON = require("./sponsors.json");
const {
  dropTables,
  runPromiseSequence,
  createDataInSequence
} = require("../../../../src/server/utils/seq-utils");

module.exports = {
  dropTables,
  runPromiseSequence,
  createUserData: () => createDataInSequence(userJSON, db.User.create.bind(db.User), {}),
  createTenantData: () => createDataInSequence(tenantJSON, db.Tenant.create.bind(db.Tenant), {}),
  createRoleData: () => createDataInSequence(roleJSON, db.Role.create.bind(db.Role), {}),
  createImageData: () => createDataInSequence(imageJSON, db.Image.create.bind(db.Image), {}),
  createCategoryData: () =>
    createDataInSequence(categoryJSON, db.TermTaxonomy.create.bind(db.TermTaxonomy), {
      include: ["terms"]
    }),
  createPostAndSponsorData: () =>
    createDataInSequence(sponsorJSON, db.Post.create.bind(db.Post), {
      include: [{ model: db.TermTaxonomy, as: "tags", include: ["terms", "image"] }]
    }),
  createPostAndTagData: () =>
    createDataInSequence(postJSON, db.Post.create.bind(db.Post), {
      include: [{ model: db.TermTaxonomy, as: "tags", include: ["terms"] }]
    }),
  createPostAndAssocData: async () => {
    await createDataInSequence(postJSON, db.Post.create.bind(db.Post), {
      include: ["post_meta", { model: db.TermTaxonomy, as: "taxonomies", include: ["terms"] }]
    });
  }
};
