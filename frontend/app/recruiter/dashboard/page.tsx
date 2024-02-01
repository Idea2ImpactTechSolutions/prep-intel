"use client";
import React from "react";

export default function Page() {

  const recruiter = {
    name: 'Jay'
  };

  const users = [{
    'Match': 207,
    'ACT': 27,
    'GPA': 2.37,
    'Major Interests': 'Business Administration',
    'Extracurriculars': 'Student Government',
    'Grad Year': 2024,
    'Selected School': 'University of Chicago',
    'AP': 'No',
    'IB': 'No',
    'Dual Enrole': 'No'
  },
  {
    'Match': 206,
    'ACT': 27,
    'GPA': 2.86,
    'Major Interests': 'Computer Science',
    'Extracurriculars': 'Chess Club',
    'Grad Year': 2024,
    'Selected School': 'Stanford University',
    'AP': 'No',
    'IB': 'No',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 205,
    'ACT': 27,
    'GPA': 3.2,
    'Major Interests': 'Business Administration',
    'Extracurriculars': 'Basketball',
    'Grad Year': 2024,
    'Selected School': 'Yale University',
    'AP': 'No',
    'IB': 'No',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 204,
    'ACT': 27,
    'GPA': 3.28,
    'Major Interests': 'Chemistry',
    'Extracurriculars': 'Basketball',
    'Grad Year': 2024,
    'Selected School': 'Yale University',
    'AP': 'Yes',
    'IB': 'Yes',
    'Dual Enrole': 'No'
  },
  {
    'Match': 203,
    'ACT': 27,
    'GPA': 3.01,
    'Major Interests': 'Chemistry',
    'Extracurriculars': 'Chess Club',
    'Grad Year': 2024,
    'Selected School': 'University of Chicago',
    'AP': 'No',
    'IB': 'Yes',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 202,
    'ACT': 27,
    'GPA': 2.8,
    'Major Interests': 'English',
    'Extracurriculars': 'Theatre',
    'Grad Year': 2024,
    'Selected School': 'Caltech',
    'AP': 'No',
    'IB': 'No',
    'Dual Enrole': 'No'
  },
  {
    'Match': 201,
    'ACT': 27,
    'GPA': 3.92,
    'Major Interests': 'English',
    'Extracurriculars': 'Volunteering',
    'Grad Year': 2024,
    'Selected School': 'University of Chicago',
    'AP': 'Yes',
    'IB': 'No',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 200,
    'ACT': 27,
    'GPA': 3.89,
    'Major Interests': 'English',
    'Extracurriculars': 'Art',
    'Grad Year': 2024,
    'Selected School': 'University of Pennsylvania',
    'AP': 'No',
    'IB': 'No',
    'Dual Enrole': 'No'
  },
  {
    'Match': 199,
    'ACT': 27,
    'GPA': 3.43,
    'Major Interests': 'Physics',
    'Extracurriculars': 'Band',
    'Grad Year': 2024,
    'Selected School': 'University of Chicago',
    'AP': 'No',
    'IB': 'No',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 198,
    'ACT': 27,
    'GPA': 3.63,
    'Major Interests': 'Biology',
    'Extracurriculars': 'Science Club',
    'Grad Year': 2024,
    'Selected School': 'Johns Hopkins University',
    'AP': 'No',
    'IB': 'Yes',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 197,
    'ACT': 27,
    'GPA': 2.43,
    'Major Interests': 'Engineering',
    'Extracurriculars': 'Band',
    'Grad Year': 2024,
    'Selected School': 'Yale University',
    'AP': 'No',
    'IB': 'Yes',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 196,
    'ACT': 27,
    'GPA': 2.03,
    'Major Interests': 'Computer Science',
    'Extracurriculars': 'Volunteering',
    'Grad Year': 2024,
    'Selected School': 'Stanford University',
    'AP': 'No',
    'IB': 'Yes',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 195,
    'ACT': 27,
    'GPA': 2.93,
    'Major Interests': 'Physics',
    'Extracurriculars': 'Band',
    'Grad Year': 2024,
    'Selected School': 'Johns Hopkins University',
    'AP': 'No',
    'IB': 'No',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 194,
    'ACT': 27,
    'GPA': 3.01,
    'Major Interests': 'History',
    'Extracurriculars': 'Student Government',
    'Grad Year': 2024,
    'Selected School': 'Harvard University',
    'AP': 'No',
    'IB': 'Yes',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 193,
    'ACT': 27,
    'GPA': 2.46,
    'Major Interests': 'Business Administration',
    'Extracurriculars': 'Theatre',
    'Grad Year': 2024,
    'Selected School': 'Yale University',
    'AP': 'Yes',
    'IB': 'No',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 192,
    'ACT': 27,
    'GPA': 2.64,
    'Major Interests': 'History',
    'Extracurriculars': 'Student Government',
    'Grad Year': 2024,
    'Selected School': 'Stanford University',
    'AP': 'No',
    'IB': 'Yes',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 191,
    'ACT': 27,
    'GPA': 3.11,
    'Major Interests': 'Biology',
    'Extracurriculars': 'Volunteering',
    'Grad Year': 2024,
    'Selected School': 'University of Chicago',
    'AP': 'Yes',
    'IB': 'No',
    'Dual Enrole': 'No'
  },
  {
    'Match': 190,
    'ACT': 27,
    'GPA': 3.02,
    'Major Interests': 'English',
    'Extracurriculars': 'Volunteering',
    'Grad Year': 2024,
    'Selected School': 'Stanford University',
    'AP': 'No',
    'IB': 'Yes',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 189,
    'ACT': 27,
    'GPA': 3.31,
    'Major Interests': 'Physics',
    'Extracurriculars': 'Volunteering',
    'Grad Year': 2024,
    'Selected School': 'MIT',
    'AP': 'No',
    'IB': 'Yes',
    'Dual Enrole': 'Yes'
  },
  {
    'Match': 188,
    'ACT': 27,
    'GPA': 2.24,
    'Major Interests': 'Chemistry',
    'Extracurriculars': 'Debate Club',
    'Grad Year': 2024,
    'Selected School': 'Johns Hopkins University',
    'AP': 'No',
    'IB': 'No',
    'Dual Enrole': 'Yes'
  }];

  return (
    <div className="container p-0 mt-8">
        <h1 className="text-xl font-bold mb-4">Welcome, {recruiter.name} </h1>
        <h2 className="">Here are students that match your profile</h2>

        <table class="table-auto">
          <thead>
            <tr>
              <th>Match</th>
              <th>ACT</th>
              <th>GPA</th>
              <th>Major Interests</th>
              <th>Extracurriculars</th>
              <th>Grad Year</th>
              <th>Selected School</th>
              <th>AP</th>
              <th>IB</th>
              <th>Dual Enrole</th>
            </tr>
          </thead>
          <tbody>
          {
            users.map(user => (
              <tr>
                <td>{user.Match}</td>
                <td>{user.ACT}</td>
                <td>{user.GPA}</td>
                <td>{user['Major Interests']}</td>
                <td>{user.Extracurriculars}</td>
                <td>{user['Grad Year']}</td>
                <td>{user['Selected School']}</td>
                <td>{user.AP}</td>
                <td>{user.IB}</td>
                <td>{user['Dual Enrole']}</td>
              </tr>))
          }
          </tbody>
        </table>
    </div>
  );
}