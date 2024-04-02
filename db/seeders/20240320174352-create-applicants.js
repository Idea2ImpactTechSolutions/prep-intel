'use strict';

const  models = require("../models");
const { Users, Students, Recruits, Applicants, Recruiter, Recruiters } = models;
const { SchoolRecruits } = require("./recruits");
const DEFAULT_SCHOOL = 'b14e03a9-656a-4726-9d38-6f09c912a543';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    // Recruiter user
    const user = await Users.create({
      email: "rec@college.edu",
      first_name: "Some",
      last_name: "Recruiter",
      school_id: DEFAULT_SCHOOL,
      role: 'recruiter',
      account_claimed: true
    });

    const recruiter = await Recruiter.create({
      school_id: DEFAULT_SCHOOL,
      user_id: user.id,
      first_name: "Jed",
      last_name: "Smith",
      email: "jed@some.edu",
    });

    // This table is quite confusing to me - I believe it's a mapping table
    // for recruiters <-> students
    const recruiters = await Recruiters.create({
      recruiter_id: recruiter.id,
      school_id: DEFAULT_SCHOOL,
      user_id: user.id,
    });

    let i = 0;

    for(let idx in SchoolRecruits) {
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

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
