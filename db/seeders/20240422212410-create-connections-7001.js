'use strict';
const { models } = require("../../app/models");
const { Users, Students, Recruiters, ConnectionRequest, School } = models;
const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // School tokens
    const schoolId = 7001
    const email = "rec@college.edu";

    // Create connections for a given school
    let user = await Users.findOne({ where: { email } });
    const recruiter = await Recruiters.findOne({ where: { user_id: user.id } });

    const students = await Students.findAll({
      limit: 3,
      include: [{
        model: Users,
        where: { school_id: schoolId, role: 'student' },
        attributes: ['id']
      }],
    });

    for (let idx in students) {
      let student = students[idx];

      await ConnectionRequest.create({
        school_id: schoolId,
        initiator_id: (idx % 2 == 0) ? student.user_id : recruiter.user_id,
        initiator_role: (idx % 2 == 0) ? "student" : "recruiter",
        recipient_id: (idx % 2 == 0) ? recruiter.user_id : student.user_id,
      });
    }

    // Create connections for a given user
    let student = students[0];

    console.log("Assigning connections to student", student.user_id);

    const schools = await School.findAll({
      limit: 6,
      where: {
        id: {
          [Op.ne]: 7001
        }
      }
    });

    for (let idx in schools) {
      let school = schools[idx];
      await ConnectionRequest.create({
        school_id: school.id,
        initiator_id: (idx % 2 == 0) ? student.id : recruiter.id,
        initiator_role: (idx % 2 == 0) ? "student" : "recruiter",
        recipient_id: (idx % 2 == 0) ? recruiter.id : student.id,
      });
    }


  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
