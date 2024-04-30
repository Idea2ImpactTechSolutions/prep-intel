'use strict';

const { models } = require("../../app/models");
const { Users, Students } = models;
const fs = require('fs');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const STUDENTS_PER_STATE = 1000

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const locations = JSON.parse(fs.readFileSync('../data/locations.json', 'utf8'));
    const majorsList = [
      "Computer Science", "Biology", "Business Administration", "Engineering", "Psychology",
      "Mathematics", "Physics", "Chemistry", "Sociology", "Economics",
      "Political Science", "History", "Literature", "Art", "Music",
      "Philosophy", "Education", "Environmental Science", "Nursing", "Marketing"
    ];
    const hobbiesList = [
      "Reading", "Gardening", "Painting", "Cooking", "Photography",
      "Hiking", "Cycling", "Gaming", "Playing an Instrument", "Crafting",
      "Traveling", "Writing", "Dancing", "Yoga", "Running",
      "Swimming", "Knitting", "Singing", "Chess", "Drawing"
    ];

    const pwd = bcrypt.hashSync('password');

    // Utility functions
    const getRandomItems = (array) => {
      const count = Math.floor(Math.random() * 5) + 1; // Between 1 and 5 items
      const shuffled = array.sort(() => 0.5 - Math.random()); // Shuffle the array
      return shuffled.slice(0, count); // Select the top 'count' items
    };

    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

    const generateRandomData = (state, count) => {
      const users = [];
      const students = [];

      for (let i = 0; i < count; ++i) {
        const first_name = faker.person.firstName();
        const last_name = faker.person.lastName();

        const user = {
          first_name,
          last_name,
          email: `${first_name}.${last_name}@example.com`.toLowerCase(), // Example email format
          password: pwd,
          role: "student",
          account_claimed: true,
          date_claimed: faker.date.between({ from: '2024-01-01', to: '2024-04-29' }),
          is_active: true,
        };

        users.push(user);

        const dob = faker.date.between({ from: '2006-01-01', to: '2006-12-31' });
        const gpa = parseFloat((Math.random() * 2 + 2).toFixed(2)); // Between 2.0 and 4.0
        const sat_score = Math.floor((gpa - 2) * 400 + 800); // 800 - 1600 range
        const act_score = Math.floor((gpa - 2) * 8 + 16); // 16 - 32 range

        const cityZipPair = getRandomItem(locations[state].cityZipPairs);
        const high_school = `${faker.location.street()} High School`;
        const guardian_first_name = faker.person.firstName()
        const student = {
          dob,
          postal: cityZipPair.zip,
          sat_score,
          act_score,
          gpa,
          city: cityZipPair.city,
          state,
          country: "USA",
          graduation_year: 2024, // Approximate graduation year
          high_school,
          guardian_first_name,
          guardian_last_name: last_name,
          guardian_email: `${guardian_first_name}.${last_name}@example.com`.toLowerCase(),
          is_active: true,
          create_date: new Date(),
          majors: getRandomItems(majorsList),
          extracurriculars: getRandomItems(hobbiesList),
        };

        students.push(student);
      }

      return { users, students };
    };

    const createStudents = async (state, count) => {
      const { users, students } = generateRandomData(state, count);

      // Create users and get their IDs
      const createdUsers = await Users.bulkCreate(users, { returning: true });

      // Add user IDs to students
      const studentsWithIDs = students.map((student, idx) => ({ ...student, user_id: createdUsers[idx].id }));

      // Insert students
      await Students.bulkCreate(studentsWithIDs);

      console.log(`${count} students from ${state} inserted.`);
    };

    // Iterate over states and create 100 students per state
    for (const state of Object.keys(locations)) {
      await createStudents(state, STUDENTS_PER_STATE);
    }
  },


  async down (queryInterface, Sequelize) {
    // Logic for reverting the migration
  
  }
};
