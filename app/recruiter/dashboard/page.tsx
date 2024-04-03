"use client";
import React from "react";
import { RecruiterDashboardUsers as users }  from "../../ui/mock-data/Users"

export default function Page() {

  const recruiter = {
    name: 'Jay'
  };

  return (
    <div className="pi-container">
        <h1 className="text-xl font-bold mb-4">Welcome, {recruiter.name} </h1>
        <h2 className="">Here are students that match your profile</h2>

        <table className="table-auto">
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
            users.map((user, index) => (
              <tr key={index}>
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