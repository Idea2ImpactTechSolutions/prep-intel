'use strict';
const  models = require("../models");
const { Schools, Managers, Users  } = models;

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  // Quickly put in a place a system to
  async up (queryInterface, Sequelize) {

    // Create one or more users for basic/default authentication
    const users = [{
        schoolId: 'b14e03a9-656a-4726-9d38-6f09c912a543',
        managerId: 123,
        userId: 345,
        firstName: 'sample',
        lastName: 'admin',
        email:'admin@x',
        role: 'admin',
      }];

    await Schools.create({
      id: users[0].schoolId,
      name: 'Token School',
      institution_type: 'College',
    });

    for(var i in users) {
      const user = users[i];

      await Managers.create({
        id: user.managerId,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        school_id: user.schoolId,
        account_claimed: true
      });

      await Users.create({
        id: user.userId,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        school_id: user.schoolId,
        role: 'admin',
        account_claimed: true
      });
    }
  },

  async down (queryInterface, Sequelize) {
      //await queryInterface.bulkDelete('People', null, {});
  }
};
