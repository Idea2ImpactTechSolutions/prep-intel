'use strict';

const  { models } = require("../../app/models");
const { School, SchoolAddress, HD2021 } = models;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const schools = await HD2021.findAll();

    await School.bulkCreate(
      schools.map(function(school) {
        let control = '';
        switch (school.control) {
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
        switch (school.iclevel) {
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

        return {
          id: school.unitid,
          name: school.instnm,
          application_url: school.applurl,
          financial_aid_url: school.faidurl,
          institution_type: `${iclevel}${control}`
        }
    }));

    const school_addrs = schools.map(function (school) {
      return {
        school_id: school.unitid,
        street_address_1: school.addr,
        city: school.city,
        state: school.stabbr,
        postal: school.zip.toString(),
      }
    });
    await SchoolAddress.bulkCreate(school_addrs);
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
