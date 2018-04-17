/* eslint no-magic-numbers: 0, new-cap: 0 */

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      post_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      tenant_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      sanitized_title: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      url: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: "Draft"
      },
      author_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ""
      },
      modules: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ""
      }
    },
    {
      tableName: "posts"
    }
  );

  Post.associate = models => {
    Post.hasMany(models.PostMeta, {
      as: "post_meta",
      foreignKey: "post_id",
      onDelete: "cascade"
    });

    Post.belongsToMany(models.TermTaxonomy, {
      as: "tags",
      foreignKey: "post_id",
      otherKey: "term_taxonomy_id",
      through: "term_relationships",
      scope: { taxonomy: "post_tag" }
    });

    Post.belongsToMany(models.TermTaxonomy, {
      as: "categories",
      foreignKey: "post_id",
      otherKey: "term_taxonomy_id",
      through: "term_relationships",
      scope: { taxonomy: "category" }
    });

    Post.belongsToMany(models.TermTaxonomy, {
      as: "sponsors",
      foreignKey: "post_id",
      otherKey: "term_taxonomy_id",
      through: "term_relationships",
      scope: { taxonomy: "sponsor" }
    });

    Post.belongsToMany(models.TermTaxonomy, {
      as: "taxonomies",
      foreignKey: "post_id",
      otherKey: "term_taxonomy_id",
      through: "term_relationships"
    });
  };

  Post.loadScopes = models => {};

  return Post;
};
