/* eslint no-magic-numbers: 0, new-cap: 0 */

module.exports = (sequelize, DataTypes) => {
  const TermRelationships = sequelize.define(
    "TermRelationships",
    {
      post_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
      },
      term_taxonomy_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
      }
    },
    {
      tableName: "term_relationships"
    }
  );

  return TermRelationships;
};
