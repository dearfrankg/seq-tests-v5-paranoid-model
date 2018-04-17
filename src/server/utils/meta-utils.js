const { dump } = require("./index");
const db = require("../models");
const _ = require("lodash");

// extrapolateContributors
const extrapolateContributors = async metaCollection => {
  const contributorsIndex = _.indexOf(metaCollection, _.find(metaCollection, "contributors"));
  if (contributorsIndex >= 0) {
    const userIdList = metaCollection[contributorsIndex].contributors;
    const scope = { method: ["userName", userIdList, 1] };
    const filter = o => ({ user_id: o.user_id, full_name: o.full_name });
    const users = await db.User.scope(scope)
      .findAll()
      .map(filter);

    metaCollection.splice(contributorsIndex, 1, { contributors: users });
  }

  return metaCollection;
};

// getPostMeta
async function getPostMeta(post) {
  // normalize metaCollection
  let metaCollection = post.post_meta.map(item => ({
    [item.meta_key]: JSON.parse(item.meta_value)
  }));
  post.post_meta = metaCollection;

  metaCollection = await extrapolateContributors(metaCollection);

  return metaCollection;
}

// setPostMeta
async function setPostMeta(postId, postMetaCollection) {
  const promises = postMetaCollection.map(async item => {
    if (Object.keys(item).length > 1) {
      throw new Error("Post meta information is formatted incorectly");
    }
    const key = Object.keys(item)[0];
    const newRecord = {
      post_id: postId,
      meta_key: key,
      meta_value: JSON.stringify(item[key])
    };
    return await db.PostMeta.create(newRecord);
  });
  await Promise.all(promises);
}

module.exports = {
  getPostMeta,
  setPostMeta
};
