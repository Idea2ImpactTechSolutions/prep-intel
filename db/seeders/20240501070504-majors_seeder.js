'use strict';

const fs = require('fs');
const { models } = require("../../app/models");
const { Department } = models;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const majorsData = JSON.parse(fs.readFileSync('../data/majors.json', 'utf8'));
    await Department.bulkCreate(majorsData);
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
