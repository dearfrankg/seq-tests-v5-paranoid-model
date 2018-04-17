const db = require("../models");
const Op = require("sequelize").Op;

const { dump } = require("../utils");

module.exports = {
  /* tenantPosts */
  tenantPosts(req) {
    const options = {
      where: {
        tenant_id: req.user.roles[req.user.currentRoleIndex].tenantId
      },

      attributes: {
        exclude: "author_id"
      },

      include: [
        "post_meta",
        {
          model: db.User,
          as: "author",
          attributes: ["user_id", "first_name", "last_name"]
        },
        {
          model: db.TermTaxonomy,
          as: "tags",
          include: ["terms"],
          through: {
            attributes: []
          }
        },
        {
          model: db.TermTaxonomy,
          as: "categories",
          include: ["terms"],
          through: {
            attributes: []
          }
        },
        {
          model: db.TermTaxonomy,
          as: "sponsors",
          include: ["terms"],
          through: {
            attributes: []
          }
        }
      ]
    };

    return options;
  },

  deletePost(req) {
    const options = {
      where: {
        post_id: req.params.id,
        tenant_id: req.user.roles[req.user.currentRoleIndex].tenantId
      },
      include: ["post_meta", "taxonomies"]
    };

    return options;
  },

  /* postTags */
  postTags(postId) {
    const options = {
      where: {
        post_id: postId
      },

      include: [
        {
          model: db.TermTaxonomy,
          as: "tags",
          include: ["terms"],
          through: {
            attributes: []
          }
        }
      ]
    };

    return options;
  },

  /* postCategories */
  postCategories(postId) {
    const options = {
      where: {
        post_id: postId
      },

      include: [
        {
          model: db.TermTaxonomy,
          as: "categories",
          include: ["terms"],
          through: {
            attributes: []
          }
        }
      ]
    };

    return options;
  },

  /* postSponsors */
  postSponsors(postId) {
    const options = {
      where: {
        post_id: postId
      },

      include: [
        {
          model: db.TermTaxonomy,
          as: "sponsors",
          include: ["terms"],
          through: {
            attributes: []
          }
        }
      ]
    };

    return options;
  },

  /* postAssociated */
  postAssociated(postId) {
    const options = {
      where: {
        post_id: postId
      },

      include: [
        {
          model: db.TermTaxonomy,
          as: "tags",
          include: ["terms"],
          through: {
            attributes: []
          }
        },
        {
          model: db.TermTaxonomy,
          as: "categories",
          include: ["terms"],
          through: {
            attributes: []
          }
        },
        {
          model: db.TermTaxonomy,
          as: "sponsors",
          include: ["terms"],
          through: {
            attributes: []
          }
        }
      ]
    };

    return options;
  },

  /* tenantTags */
  tenantTags(req, nameList) {
    const options = {
      where: {
        tenant_id: req.user.roles[req.user.currentRoleIndex].tenantId,
        taxonomy: "post_tag"
      },

      include: [
        {
          model: db.Term,
          as: "terms",
          where: {
            name: { [Op.in]: nameList }
          }
        }
      ]
    };

    return options;
  },

  /* tenantCategories */
  tenantCategories(req, nameList) {
    const options = {
      where: {
        tenant_id: req.user.roles[req.user.currentRoleIndex].tenantId,
        taxonomy: "category"
      },

      include: [
        {
          model: db.Term,
          as: "terms",
          where: {
            name: { [Op.in]: nameList }
          }
        }
      ]
    };

    return options;
  },

  /* tenantSponsors */
  tenantSponsors(req, nameList) {
    const options = {
      where: {
        tenant_id: req.user.roles[req.user.currentRoleIndex].tenantId,
        taxonomy: "sponsor"
      },

      include: [
        {
          model: db.Term,
          as: "terms",
          where: {
            name: { [Op.in]: nameList }
          }
        }
      ]
    };

    return options;
  }
};
