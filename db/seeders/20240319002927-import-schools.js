'use strict';

const ICDirectory = require("../../app/models/ICDirectory");
const  models = require("../models");
const { Schools, SchoolAddresses  } = models;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const schools = await ICDirectory.findAll({
      where: {
        STABBR: 'ID',
      },
    });

    let i = 0;

    for(let idx in schools) {
      const school = schools[idx];

      let control = '';
      switch(school.CONTROL) {
        case 1:
          control = 'Public'
          break;
        case 2:
          control = 'Private not-for-profit'
          break;
        case 3:
          control = 'Private for-profit'
            break;
      }

      let iclevel = '';
      switch(school.ICLEVEL) {
        case 1:
          iclevel = '4-year, '
          break;
        case 2:
          iclevel = '2-year, '
          break;
        case 3:
          iclevel = '< 2-year, '
            break;
      }

      const newSchool = await Schools.create({
        id: school.UNITID,
        name: school.INSTNM,
        application_url: school.APPLURL,
        financial_aid_url: school.FAIDURL,
        institution_type: `${iclevel}${control}`
      });

      const address = SchoolAddresses.create({
        school_id: school.UNITID,
        street_address_1: school.ADDR,
        city: school.CITY,
        state: school.STABBR,
        postal: school.ZIP,
      });
    }
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
