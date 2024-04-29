'use strict';

const { models } = require("../../app/models");
const { Users, Students, School } = models;
const XLSX = require('xlsx');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const path = '../data/2022_23_sample_students.xlsx';
    const workbook = XLSX.readFile(path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    const getColumnNames = () =>{
      const columnNames = [];
      for(let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "2"; // Target the second row, assuming headers are here
        const cell = worksheet[address];
        if(cell){
          columnNames.push(cell.v);
        }else{
          columnNames.push("Ignore");
        }
      }
      return columnNames;
    }

    const buildStudents = (columnNames) => {
      const students = [];
      for (let R = range.s.r + 2; R <= range.e.r; ++R) { // Start from the third row
        let count=0;
        const student = {};
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({c: C, r: R});
          const cell = worksheet[cellAddress];
          const columnName = columnNames[C - range.s.c]; // Get the column name from headers
          student[columnName] = cell ? cell.v : null; // Assign the cell value to the corresponding key in the student object
        }
        students.push(student);
        count++;
        if(count == 3){
          break;
        }
      
      }
      return students;
    };
    const columnNames = getColumnNames();
    const students = buildStudents(columnNames);
    console.log("columnNames", students);

    // read in excel file
    //iterate through rows, anonymize names and email 
    //create record for 10 states with different name and email for each row
    
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
