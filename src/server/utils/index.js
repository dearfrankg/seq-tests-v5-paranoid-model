/* eslint no-console: 0 */

const dump = function(title, json) {
  console.log(title);
  const INDENTION = 2;
  console.log(JSON.stringify(json, null, INDENTION));
};

const getSlug = function(name) {
  return name
    .replace(/[^\w\s]/gi, "")
    .toLowerCase()
    .split(" ")
    .reduce((prev, next) => {
      return next !== "" ? [prev, next].join("-") : prev;
    });
};

const getQueryParams = function(req, paramList = []) {
  const optionList = [
    { name: "limit", type: "int" },
    { name: "offset", type: "int" },
    { name: "order", type: "string" },
    { name: "group", type: "string" },
    { name: "search", type: "string" }
  ];

  const options = {};
  optionList.forEach(item => {
    if (req.query[item.name]) {
      options[item.name] =
        item.type === "int" ? parseInt(req.query[item.name], 10) : req.query[item.name];
    }
  });
  if (!options.limit) {
    options.limit = 100;
  }

  const params = {};
  paramList.forEach(item => {
    params[item.name] =
      item.type === "int" ? parseInt(req.query[item.name], 10) : req.query[item.name];
  });

  return [options, params];
};

function getRequestedOptions(req) {
  const requestedOptions = {};
  ["limit", "offset", "order", "group"].forEach(option => {
    const requestedOption = req.query[option];
    if (requestedOption) {
      requestedOptions[option] =
        option === "limit" || option === "offset" ? parseInt(requestedOption, 10) : requestedOption;
    }
  });
  const DEFAULT_LIMIT = 100;
  if (!requestedOptions.limit || requestedOptions.limit > DEFAULT_LIMIT) {
    requestedOptions.limit = DEFAULT_LIMIT;
  }

  return requestedOptions;
}

function isCollection(collection) {
  const collectionIsArray = Array.isArray(collection);
  let collectionContainsArrayOfObjects = true;
  collection.forEach(item => {
    if (typeof item !== "object") {
      collectionContainsArrayOfObjects = false;
    }
  });

  return collectionIsArray && collectionContainsArrayOfObjects;
}

function containsProperties(obj, properties) {
  const keys = Object.keys(obj);
  let result = true;
  properties.forEach(prop => {
    if (!keys.includes(prop)) {
      result = false;
    }
  });
  return result;
}

function deepFetch(target, query, defaultReturn = {}) {
  query = query.split(".");
  let obj = target[query.shift()];
  while (query.length) obj = obj ? obj[query.shift()] : defaultReturn;
  return obj === 0 ? 0 : obj || defaultReturn;
}

// waitAsync.js
function waitAsync(asyncFn) {
  return function(req, res, next) {
    asyncFn(req, res, next).catch(next);
  };
}

module.exports = {
  waitAsync,
  dump,
  deepFetch,
  getSlug,
  getQueryParams,
  getRequestedOptions,
  isCollection,
  containsProperties
};
