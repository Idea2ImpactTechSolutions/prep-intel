'use strict';

const fs = require('fs');
const { models } = require("../../app/models");
const { Extracurricular } = models;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const extracurricularData = JSON.parse(fs.readFileSync('../data/extracurricular.json', 'utf8'));
    await Extracurricular.bulkCreate(extracurricularData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
