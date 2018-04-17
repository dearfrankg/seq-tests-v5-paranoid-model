Hello, I’m having trouble with a model file for a through table.

Why is my model file not dictating what goes into the table?

No matter what I put into the model file I get a different schema in the database.

OPTIONS
timestamps: true,
paranoid: true

Having these options provides the following columns for each table.

`created_at` datetime NOT NULL,
`updated_at` datetime NOT NULL,
`deleted_at` datetime DEFAULT NULL,

The one exception is the TermRelationship through table which is missing the deleted_at column.

MODEL FILE FOR THROUGH TABLE

```
module.exports = (sequelize, DataTypes) => {
  const TermRelationships = sequelize.define(
    "TermRelationships",
    {
      term_relationship_id: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      foo: {
        type: DataTypes.BIGINT(20).UNSIGNED,
        allowNull: false
      }
      // post_id: {
      //   type: DataTypes.BIGINT(20).UNSIGNED,
      //   allowNull: false
      // },
      // term_taxonomy_id: {
      //   type: DataTypes.BIGINT(20).UNSIGNED,
      //   allowNull: false
      // }
    },
    {
      tableName: "term_relationships"
    }
  );

  return TermRelationships;
};
```

DATABASE TABLE

```
CREATE TABLE `term_relationships` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `post_id` bigint(20) unsigned NOT NULL,
  `term_taxonomy_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`post_id`,`term_taxonomy_id`),
  KEY `term_taxonomy_id` (`term_taxonomy_id`),
  CONSTRAINT `term_relationships_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `term_relationships_ibfk_2` FOREIGN KEY (`term_taxonomy_id`) REFERENCES `term_taxonomies` (`term_taxonomy_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

Additionally

* the date fields get appended to all other tables except this through table.
* I think this is causing another problem when I try to destroy a through record:
  SequelizeDatabaseError: Unknown column ‘deleted_at’ in ‘where clause’
