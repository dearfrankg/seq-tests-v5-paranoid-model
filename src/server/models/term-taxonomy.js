/* eslint no-magic-numbers: 0, new-cap: 0 */

module.exports = (sequelize, DataTypes) => {
  const TermTaxonomy = sequelize.define(
    "TermTaxonomy",
    {
      term_taxonomy_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      tenant_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      term_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: true
      },
      taxonomy: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      parent: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: true
      },
      count: {
        type: DataTypes.BIGINT(20),
        default: 0
      }
    },
    {
      tableName: "term_taxonomies"
    }
  );

  TermTaxonomy.associate = models => {
    TermTaxonomy.belongsToMany(models.Post, {
      as: "posts",
      foreignKey: "term_taxonomy_id",
      through: "term_relationships"
    });

    TermTaxonomy.hasOne(models.Term, {
      as: "terms",
      foreignKey: "term_id",
      targetKey: "term_taxonomy_id",
      onDelete: "cascade"
    });
  };

  TermTaxonomy.loadScopes = () => {
    TermTaxonomy.addScope("tenant", (tenantId, taxonomy) => {
      const conditions = taxonomy
        ? {
            tenant_id: tenantId,
            taxonomy
          }
        : {
            tenant_id: tenantId
          };

      const result = {
        where: conditions
      };

      return result;
    });
  };

  return TermTaxonomy;
};
