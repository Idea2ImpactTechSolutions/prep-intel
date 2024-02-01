"use client";
import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { SchoolRecruits as recruits }  from "../../../ui/mock-data/Users"
import { IoMdEye } from "react-icons/io";
import { FaEdit } from "react-icons/fa";

export default function Page() {

  return (
    <Formik>
    <div className="container p-0 mt-8">
        <h1 className="text-xl font-bold mb-4">Recruits</h1>
        <hr className="border-t border-gray-200 mt-4 mb-8" />

        <div className="w-full mt-5 flex">
          <div className="w-[40%]">
            <Field
                name="school_email"
                type="text"
                placeholder="Search"
                className="border-2 py-1 px-2 rounded-md w-full"
            />
            <ErrorMessage
                name="school_email"
                component="div"
                className="text-red-500"
            />
          </div>
          <div className="flex-grow"></div>

          <button type="submit" className="flex items-center bg-primary hover:bg-primary-500 text-white font-bold py-3 px-4 rounded mr-1">
              <div className="leading-none inline-block -mt-1">Filters</div>
          </button>

        </div>

        <table class="table-auto">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Application Status</th>
              <th>Recruitment Source</th>
              <th>Application Date</th>
              <th>Recruiter Name</th>
              <th>Program of Interest</th>
              <th>Email Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {
            recruits.map(user => (
              <tr>
                <td>{user['Full Name']}</td>
                <td>{user['Application Status']}</td>
                <td>{user['Recruitment Source']}</td>
                <td>{user['Application Date']}</td>
                <td>{user['Recruiter Name']}</td>
                <td>{user['Program of Interest']}</td>
                <td>{user['Email Address']}</td>
                <td ><div className="flex "><IoMdEye className="mr-4" /> <FaEdit /></div></td>
              </tr>))
          }
          </tbody>
        </table>
    </div>
    </Formik>
  );
}