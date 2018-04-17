"use strict";

const db = require("../../../../src/server/models");
const fixtures = require("../fixtures");

describe("API roles routes", () => {
  beforeEach(async () => {
    await fixtures.dropTables();
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe("Route /roles", () => {
    describe("#list - list roles (GET)", () => {
      it("should return a list of roles", async () => {
        expect(true).toBe(true);
      });
    });
  });
});
