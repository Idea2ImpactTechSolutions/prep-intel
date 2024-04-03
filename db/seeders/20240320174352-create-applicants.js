'use strict';

const { models } = require("../../app/models");
const { Users, Students, Recruits, Applicants, Recruiters } = models;
const { SchoolRecruits } = require("../recruits");
const DEFAULT_SCHOOL = 'b14e03a9-656a-4726-9d38-6f09c912a543';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Recruiter user
    const recruiterUser = await Users.create({
      email: "rec@college.edu",
      first_name: "Some",
      last_name: "Recruiter",
      school_id: DEFAULT_SCHOOL,
      role: 'recruiter',
      account_claimed: true
    });

    const recruiters = await Recruiters.create({
      recruiter_id: recruiterUser.id,
      school_id: DEFAULT_SCHOOL,
      user_id: recruiterUser.id,
    });

    let i = 0;

    for (let idx in SchoolRecruits) {
      const recruit = SchoolRecruits[idx];

      const fullName = recruit['Full Name'];
      const segments = fullName.split(' ');
      const first = segments[0];
      const last = segments[1];

      const user = await Users.create({
        first_name: first,
        last_name: last,
        school_id: DEFAULT_SCHOOL,
        email: recruit["Email Address"],
        role: "student",
        is_active: true
      });

      const student = await Students.create({
        user_id: user.id,
      });

      const recruits = await Recruits.create({
        student_id: student.id,
        recruiter_id: recruiters.id,
        school_id: DEFAULT_SCHOOL,
      });

      if (i++ % 3 == 0) {
        await Applicants.create({
          student_id: student.id,
          recruiter_id: recruiters.id,
          school_id: DEFAULT_SCHOOL,
          applicant_status: "applied", // todo
          application_status: "applying", // todo
        });
      }
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
