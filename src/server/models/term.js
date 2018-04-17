/* eslint no-magic-numbers: 0, new-cap: 0 */
const { getSlug } = require("../utils");

module.exports = (sequelize, DataTypes) => {
  const Term = sequelize.define(
    "Term",
    {
      term_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        primaryKey: true
        // autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      slug: {
        type: DataTypes.VIRTUAL(200),
        get() {
          return getSlug(this.getDataValue("name"));
        }
      },
      term_group: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: "terms"
    }
  );

  Term.associate = models => {
    Term.belongsTo(models.TermTaxonomy, {
      foreignKey: "term_id",
      onDelete: "cascade"
    });
  };

  Term.loadScopes = models => {
    Term.addScope("post_tag", tenantId => {
      return {
        include: [
          {
            model: models.TermTaxonomy,
            where: {
              tenant_id: tenantId,
              taxonomy: "post_tag"
            },
            attributes: ["description"]
          }
        ]
      };
    });
  };

  return Term;
};
