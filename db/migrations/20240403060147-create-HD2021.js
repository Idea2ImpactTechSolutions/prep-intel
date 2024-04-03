'use strict';
/** @type {import('sequelize-cli').Migration} */

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HD2021', {
      unitid: {
        type: Sequelize.INTEGER
      },
      instnm: {
        type: Sequelize.STRING
      },
      ialias: {
        type: Sequelize.STRING
      },
      addr: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      stabbr: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.STRING
      },
      fips: {
        type: Sequelize.SMALLINT
      },
      obereg: {
        type: Sequelize.SMALLINT
      },
      chfnm: {
        type: Sequelize.STRING
      },
      chftitle: {
        type: Sequelize.STRING
      },
      gentele: {
        type: Sequelize.STRING
      },
      ein: {
        type: Sequelize.STRING
      },
      duns: {
        type: Sequelize.STRING
      },
      opeid: {
        type: Sequelize.STRING
      },
      opeflag: {
        type: Sequelize.SMALLINT
      },
      webaddr: {
        type: Sequelize.STRING
      },
      adminurl: {
        type: Sequelize.STRING
      },
      faidurl: {
        type: Sequelize.STRING
      },
      applurl: {
        type: Sequelize.STRING
      },
      npricurl: {
        type: Sequelize.STRING
      },
      veturl: {
        type: Sequelize.STRING
      },
      athurl: {
        type: Sequelize.STRING
      },
      disaurl: {
        type: Sequelize.STRING
      },
      sector: {
        type: Sequelize.SMALLINT
      },
      iclevel: {
        type: Sequelize.SMALLINT
      },
      control: {
        type: Sequelize.SMALLINT
      },
      hloffer: {
        type: Sequelize.SMALLINT
      },
      ugoffer: {
        type: Sequelize.SMALLINT
      },
      groffer: {
        type: Sequelize.SMALLINT
      },
      hdegofr1: {
        type: Sequelize.SMALLINT
      },
      deggrant: {
        type: Sequelize.SMALLINT
      },
      hbcu: {
        type: Sequelize.SMALLINT
      },
      hospital: {
        type: Sequelize.SMALLINT
      },
      medical: {
        type: Sequelize.SMALLINT
      },
      tribal: {
        type: Sequelize.SMALLINT
      },
      locale: {
        type: Sequelize.SMALLINT
      },
      openpubl: {
        type: Sequelize.SMALLINT
      },
      act: {
        type: Sequelize.STRING
      },
      newid: {
        type: Sequelize.INTEGER
      },
      deathyr: {
        type: Sequelize.INTEGER
      },
      closedat: {
        type: Sequelize.STRING
      },
      cyactive: {
        type: Sequelize.SMALLINT
      },
      postsec: {
        type: Sequelize.SMALLINT
      },
      pseflag: {
        type: Sequelize.SMALLINT
      },
      pset4flg: {
        type: Sequelize.SMALLINT
      },
      rptmth: {
        type: Sequelize.SMALLINT
      },
      instcat: {
        type: Sequelize.SMALLINT
      },
      c21basic: {
        type: Sequelize.SMALLINT
      },
      c21ipug: {
        type: Sequelize.SMALLINT
      },
      c21ipgrd: {
        type: Sequelize.SMALLINT
      },
      c21ugprf: {
        type: Sequelize.SMALLINT
      },
      c21enprf: {
        type: Sequelize.SMALLINT
      },
      c21szset: {
        type: Sequelize.SMALLINT
      },
      c18basic: {
        type: Sequelize.SMALLINT
      },
      c15basic: {
        type: Sequelize.SMALLINT
      },
      ccbasic: {
        type: Sequelize.SMALLINT
      },
      carnegie: {
        type: Sequelize.SMALLINT
      },
      landgrnt: {
        type: Sequelize.SMALLINT
      },
      instsize: {
        type: Sequelize.SMALLINT
      },
      f1systyp: {
        type: Sequelize.SMALLINT
      },
      f1sysnam: {
        type: Sequelize.STRING
      },
      f1syscod: {
        type: Sequelize.STRING
      },
      cbsa: {
        type: Sequelize.INTEGER
      },
      cbsatype: {
        type: Sequelize.SMALLINT
      },
      csa: {
        type: Sequelize.SMALLINT
      },
      necta: {
        type: Sequelize.INTEGER
      },
      countycd: {
        type: Sequelize.INTEGER
      },
      countynm: {
        type: Sequelize.STRING
      },
      cngdstcd: {
        type: Sequelize.INTEGER
      },
      longitud: {
        type: Sequelize.DECIMAL
      },
      latitude: {
        type: Sequelize.DECIMAL
      },
      dfrcgid: {
        type: Sequelize.SMALLINT
      },
      dfrcuscg: {
        type: Sequelize.SMALLINT
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HD2021');
  }
};
