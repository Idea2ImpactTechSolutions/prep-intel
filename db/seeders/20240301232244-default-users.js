'use strict';
const { password } = require("../../app/config/config");
const { models } = require("../../app/models");
const bcrypt = require('bcryptjs');

const { School, Managers, Users } = models;
const DEFAULT_SCHOOL = 7001;

/** @type {import('sequelize-cli').Migration} */
module.exports = {

    // Quickly put in a place a system to
    async up(queryInterface, Sequelize) {
        // Create one or more users for basic/default authentication
        const users = [{
            schoolId: DEFAULT_SCHOOL,
            firstName: 'sample',
            lastName: 'admin',
            email: 'admin@x',
            auth_code: '1234',
            role: 'admin',
        }];

        await School.create({
            id: users[0].schoolId,
            name: 'Token School',
            institution_type: 'College',
        });

        for (var i in users) {
            const user = users[i];

            const adminUser = await Users.create({
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                school_id: user.schoolId,
                role: 'admin',
                password: bcrypt.hashSync('password'),
                auth_code: user.auth_code,
                account_claimed: true,
                is_active: true,
                account_claimed: false,
            });

            await Managers.create({
                user_id: adminUser.id,
            });
        }
    },

    async down(queryInterface, Sequelize) {
        //await queryInterface.bulkDelete('People', null, {});
    }
};
