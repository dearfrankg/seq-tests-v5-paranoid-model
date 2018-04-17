/* eslint no-magic-numbers: 0, new-cap: 0 */

module.exports = (sequelize, DataTypes) => {
  const PostMeta = sequelize.define(
    "PostMeta",
    {
      post_meta_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      post_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
      },
      meta_key: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      meta_value: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      tableName: "post_meta"
    }
  );

  PostMeta.associate = models => {};

  return PostMeta;
};
