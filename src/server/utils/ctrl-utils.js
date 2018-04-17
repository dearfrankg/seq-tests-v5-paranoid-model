const { dump } = require("../utils");
const db = require("../models");
const scope = require("./scope-utils");

const updateTaxonomy = async (req, post, postTaxonomies) => {
  // *** add code to skip if no changes ***
  // *** add code to skip if no changes ***
  // *** add code to skip if no changes ***

  const typeMap = {
    categories: {
      taxonomy: "category",
      seqMethod: "addCategory",
      scopeMethod: "tenantCategories"
    },
    tags: {
      taxonomy: "post_tag",
      seqMethod: "addTag",
      scopeMethod: "tenantTags"
    },
    sponsors: {
      taxonomy: "sponsor",
      seqMethod: "addSponsor",
      scopeMethod: "tenantSponsors"
    }
  };

  console.log("post.post_id: ", post.post_id);
  // remove old associations
  await db.TermRelationships.destroy({ where: { post_id: post.post_id } }).catch(e => {
    console.log("e: ", e);
  });

  // for (const type in postTaxonomies) {
  //   const termList = postTaxonomies[type].map(o => o.terms.name);
  //   const scopeMethod = typeMap[type].scopeMethod;
  //   const taxonomy = typeMap[type].taxonomy;
  //   const seqMethod = typeMap[type].seqMethod;

  //   // determine which items are missing
  //   const options = scope[scopeMethod](req, termList);
  //   const existing = await db.TermTaxonomy.findAll(options).map(o => o.toJSON());
  //   const missing = termList.filter(item => !existing.includes(item));

  //   // create missing items
  //   const promises = postTaxonomies[type]
  //     .filter(item => missing.includes(item.terms.name))
  //     .map(async item => {
  //       item.taxonomy = taxonomy;
  //       await db.TermTaxonomy.create(item, { include: ["terms"] });
  //     });
  //   await Promise.all(promises);

  //   // create new associations
  //   const options2 = scope[scopeMethod](req, termList);
  //   await db.TermTaxonomy.findAll(options2).map(async item => {
  //     await post[seqMethod](item);
  //   });
  // }
};

module.exports = {
  updateTaxonomy
};
