const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "accreditations", deps: []
 * createTable() => "amenities", deps: []
 * createTable() => "departments", deps: []
 * createTable() => "extracurriculars", deps: []
 * createTable() => "messages", deps: []
 * createTable() => "phones", deps: []
 * createTable() => "recruiter_states", deps: []
 * createTable() => "school_form_history", deps: []
 * createTable() => "school_forms_history", deps: []
 * createTable() => "school_images", deps: []
 * createTable() => "school_research_programs", deps: []
 * createTable() => "schools", deps: []
 * createTable() => "users", deps: [schools]
 * createTable() => "assets", deps: [schools]
 * createTable() => "recruiters", deps: [schools, users]
 * createTable() => "managers", deps: [users]
 * createTable() => "students", deps: [users]
 * createTable() => "recruiter", deps: [schools]
 * createTable() => "notes", deps: [students]
 * createTable() => "opt_out_logs", deps: [students]
 * createTable() => "school_accreditations", deps: [schools, accreditations]
 * createTable() => "school_addresses", deps: [schools]
 * createTable() => "school_amenities", deps: [amenities]
 * createTable() => "school_contacts", deps: [schools]
 * createTable() => "school_departments", deps: [schools]
 * createTable() => "school_extracurriculars", deps: [extracurriculars]
 * createTable() => "school_social_medias", deps: [schools]
 * createTable() => "applicants", deps: [students, schools, recruiters]
 * createTable() => "recruits", deps: [students, recruiters, schools]
 * createTable() => "student_connections", deps: [students]
 * createTable() => "student_department_interests", deps: [students]
 * createTable() => "student_extracurriculars", deps: [students]
 *
 */

const info = {
  revision: 1,
  name: "noname",
  created: "2024-03-29T00:42:39.032Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "accreditations",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        name: { type: Sequelize.STRING(255), field: "name", allowNull: true },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "amenities",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        name: { type: Sequelize.STRING(255), field: "name", allowNull: true },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "departments",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        name: { type: Sequelize.STRING(255), field: "name", allowNull: false },
        category: {
          type: Sequelize.STRING(100),
          field: "category",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "extracurriculars",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        name: { type: Sequelize.STRING(255), field: "name", allowNull: true },
        category: {
          type: Sequelize.STRING(50),
          field: "category",
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "messages",
      {
        message_id: {
          type: Sequelize.INTEGER,
          field: "message_id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        sender_id: {
          type: Sequelize.INTEGER,
          field: "sender_id",
          allowNull: false,
        },
        sender_role: {
          type: Sequelize.STRING(20),
          field: "sender_role",
          allowNull: false,
        },
        recipient_id: {
          type: Sequelize.INTEGER,
          field: "recipient_id",
          allowNull: false,
        },
        recipient_role: {
          type: Sequelize.STRING(20),
          field: "recipient_role",
          allowNull: false,
        },
        message_text: {
          type: Sequelize.TEXT,
          field: "message_text",
          allowNull: false,
        },
        sent_at: {
          type: Sequelize.DATE,
          field: "sent_at",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "phones",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          allowNull: true,
        },
        type: { type: Sequelize.STRING(255), field: "type", allowNull: true },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "recruiter_states",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        recruiter_id: {
          type: Sequelize.INTEGER,
          field: "recruiter_id",
          allowNull: true,
        },
        state: { type: Sequelize.STRING(2), field: "state", allowNull: true },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_form_history",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          allowNull: true,
        },
        version_data: {
          type: Sequelize.JSONB,
          field: "version_data",
          allowNull: true,
        },
        unpublish_date: {
          type: Sequelize.DATE,
          field: "unpublish_date",
          allowNull: true,
        },
        publish_date: {
          type: Sequelize.DATE,
          field: "publish_date",
          allowNull: true,
        },
        created_by: {
          type: Sequelize.INTEGER,
          field: "created_by",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_forms_history",
      {
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          primaryKey: true,
          allowNull: false,
        },
        version_data: {
          type: Sequelize.JSONB,
          field: "version_data",
          allowNull: true,
        },
        is_published: {
          type: Sequelize.BOOLEAN,
          field: "is_published",
          allowNull: true,
        },
        create_date: {
          type: Sequelize.DATE,
          field: "create_date",
          allowNull: true,
        },
        publish_date: {
          type: Sequelize.DATE,
          field: "publish_date",
          allowNull: true,
        },
        last_modified_by: {
          type: Sequelize.INTEGER,
          field: "last_modified_by",
          allowNull: true,
        },
        last_modified_date: {
          type: Sequelize.DATE,
          field: "last_modified_date",
          allowNull: true,
        },
        created_by: {
          type: Sequelize.INTEGER,
          field: "created_by",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_images",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          allowNull: true,
        },
        url: { type: Sequelize.STRING(255), field: "url", allowNull: true },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_research_programs",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          allowNull: true,
        },
        research_program: {
          type: Sequelize.STRING(255),
          field: "research_program",
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: true,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: true },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "schools",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
          initialAutoIncrement: 700000
        },
        found_date: {
          type: Sequelize.DATE,
          field: "found_date",
          allowNull: true,
        },
        institution_type: {
          type: Sequelize.STRING(255),
          field: "institution_type",
          allowNull: true,
        },
        name: { type: Sequelize.STRING(255), field: "name", allowNull: true },
        intro_paragraph: {
          type: Sequelize.TEXT,
          field: "intro_paragraph",
          allowNull: true,
        },
        primary_color: {
          type: Sequelize.INTEGER,
          field: "primary_color",
          allowNull: true,
        },
        tagline: {
          type: Sequelize.STRING(255),
          field: "tagline",
          allowNull: true,
        },
        act_required: {
          type: Sequelize.BOOLEAN,
          field: "act_required",
          allowNull: true,
        },
        min_act_score: {
          type: Sequelize.INTEGER,
          field: "min_act_score",
          allowNull: true,
        },
        sat_required: {
          type: Sequelize.BOOLEAN,
          field: "sat_required",
          allowNull: true,
        },
        min_sat_score: {
          type: Sequelize.INTEGER,
          field: "min_sat_score",
          allowNull: true,
        },
        diploma_required: {
          type: Sequelize.BOOLEAN,
          field: "diploma_required",
          allowNull: true,
        },
        gpa_requirement: {
          type: Sequelize.DOUBLE,
          field: "gpa_requirement",
          allowNull: true,
        },
        in_state_tuition: {
          type: Sequelize.DOUBLE,
          field: "in_state_tuition",
          allowNull: true,
        },
        out_state_tuition: {
          type: Sequelize.DOUBLE,
          field: "out_state_tuition",
          allowNull: true,
        },
        fees_per_semester: {
          type: Sequelize.DOUBLE,
          field: "fees_per_semester",
          allowNull: true,
        },
        scholarship_url: {
          type: Sequelize.STRING(255),
          field: "scholarship_url",
          allowNull: true,
        },
        financial_aid_url: {
          type: Sequelize.STRING(255),
          field: "financial_aid_url",
          allowNull: true,
        },
        application_url: {
          type: Sequelize.STRING(255),
          field: "application_url",
          allowNull: true,
        },
        interested_inquiry_url: {
          type: Sequelize.STRING(255),
          field: "interested_inquiry_url",
          allowNull: true,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          field: "is_active",
          allowNull: true,
        },
        publish_date: {
          type: Sequelize.DATE,
          field: "publish_date",
          allowNull: true,
        },
        deactivation_date: {
          type: Sequelize.DATE,
          field: "deactivation_date",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        email: {
          type: Sequelize.STRING(255),
          field: "email",
          unique: "users_email_key",
          allowNull: true,
        },
        password: {
          type: Sequelize.STRING(255),
          field: "password",
          allowNull: true,
        },
        role: { type: Sequelize.STRING(50), field: "role", allowNull: false },
        first_name: {
          type: Sequelize.STRING(255),
          field: "first_name",
          allowNull: true,
        },
        last_name: {
          type: Sequelize.STRING(255),
          field: "last_name",
          allowNull: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: true,
        },
        auth_code: {
          type: Sequelize.STRING(255),
          field: "auth_code",
          allowNull: true,
        },
        account_claimed: {
          type: Sequelize.BOOLEAN,
          field: "account_claimed",
          defaultValue: false,
          allowNull: true,
        },
        date_claimed: {
          type: Sequelize.DATE,
          field: "date_claimed",
          allowNull: true,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          field: "is_active",
          defaultValue: true,
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "assets",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: true,
        },
        category: {
          type: Sequelize.STRING(255),
          field: "category",
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: true,
        },
        location: {
          type: Sequelize.STRING(255),
          field: "location",
          allowNull: true,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          field: "is_active",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "recruiters",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          field: "user_id",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
        territories: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          field: "territories",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "managers",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          field: "user_id",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "students",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        dob: { type: Sequelize.DATEONLY, field: "dob", allowNull: true },
        city: { type: Sequelize.STRING(100), field: "city", allowNull: true },
        state: { type: Sequelize.STRING(100), field: "state", allowNull: true },
        country: {
          type: Sequelize.STRING(100),
          field: "country",
          allowNull: true,
        },
        graduation_year: {
          type: Sequelize.INTEGER,
          field: "graduation_year",
          allowNull: true,
        },
        high_school: {
          type: Sequelize.STRING(255),
          field: "high_school",
          allowNull: true,
        },
        guardian_first_name: {
          type: Sequelize.STRING(255),
          field: "guardian_first_name",
          allowNull: true,
        },
        guardian_last_name: {
          type: Sequelize.STRING(255),
          field: "guardian_last_name",
          allowNull: true,
        },
        guardian_email: {
          type: Sequelize.STRING(255),
          field: "guardian_email",
          allowNull: true,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          field: "is_active",
          allowNull: true,
        },
        create_date: {
          type: Sequelize.DATE,
          field: "create_date",
          allowNull: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          field: "user_id",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "recruiter",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: true,
        },
        first_name: {
          type: Sequelize.STRING(255),
          field: "first_name",
          allowNull: true,
        },
        last_name: {
          type: Sequelize.STRING(255),
          field: "last_name",
          allowNull: true,
        },
        email: { type: Sequelize.STRING(255), field: "email", allowNull: true },
        auth_code: {
          type: Sequelize.STRING(255),
          field: "auth_code",
          allowNull: true,
        },
        account_claimed: {
          type: Sequelize.BOOLEAN,
          field: "account_claimed",
          allowNull: true,
        },
        create_date: {
          type: Sequelize.DATE,
          field: "create_date",
          allowNull: true,
        },
        claim_date: {
          type: Sequelize.DATE,
          field: "claim_date",
          allowNull: true,
        },
        auth_code_expiration: {
          type: Sequelize.DATE,
          field: "auth_code_expiration",
          allowNull: true,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          field: "is_active",
          allowNull: true,
        },
        deactivation_date: {
          type: Sequelize.DATE,
          field: "deactivation_date",
          allowNull: true,
        },
        status: {
          type: Sequelize.STRING(20),
          field: "status",
          allowNull: true,
        },
        last_login_date: {
          type: Sequelize.DATE,
          field: "last_login_date",
          allowNull: true,
        },
        phone: { type: Sequelize.STRING(20), field: "phone", allowNull: true },
        notification_method: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "notification_method",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "notes",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        student_id: {
          type: Sequelize.INTEGER,
          field: "student_id",
          references: { model: "students", key: "id" },
          allowNull: false,
        },
        recruiter_id: {
          type: Sequelize.INTEGER,
          field: "recruiter_id",
          allowNull: false,
        },
        note_text: {
          type: Sequelize.TEXT,
          field: "note_text",
          allowNull: false,
        },
        create_date: {
          type: Sequelize.DATE,
          field: "create_date",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "opt_out_logs",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        recruiter_id: {
          type: Sequelize.INTEGER,
          field: "recruiter_id",
          allowNull: true,
        },
        student_id: {
          type: Sequelize.INTEGER,
          field: "student_id",
          references: { model: "students", key: "id" },
          allowNull: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          allowNull: true,
        },
        reason: { type: Sequelize.TEXT, field: "reason", allowNull: true },
        opt_out_date: {
          type: Sequelize.DATE,
          field: "opt_out_date",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_accreditations",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: true,
        },
        accreditation_id: {
          type: Sequelize.INTEGER,
          field: "accreditation_id",
          references: { model: "accreditations", key: "id" },
          allowNull: true,
        },
        is_active: {
          type: Sequelize.INTEGER,
          field: "is_active",
          allowNull: true,
        },
        name: { type: Sequelize.TEXT, field: "name", allowNull: true },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_addresses",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: true,
        },
        name: { type: Sequelize.STRING(255), field: "name", allowNull: true },
        type: { type: Sequelize.STRING(50), field: "type", allowNull: true },
        street_address_1: {
          type: Sequelize.STRING(255),
          field: "street_address_1",
          allowNull: true,
        },
        street_address_2: {
          type: Sequelize.STRING(255),
          field: "street_address_2",
          allowNull: true,
        },
        city: { type: Sequelize.STRING(100), field: "city", allowNull: true },
        state: { type: Sequelize.STRING(100), field: "state", allowNull: true },
        postal: { type: Sequelize.INTEGER, field: "postal", allowNull: true },
        country: {
          type: Sequelize.STRING(2),
          field: "country",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_amenities",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          allowNull: true,
        },
        amenity_id: {
          type: Sequelize.INTEGER,
          field: "amenity_id",
          references: { model: "amenities", key: "id" },
          allowNull: true,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          field: "is_active",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_contacts",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: true,
        },
        phone: { type: Sequelize.STRING(20), field: "phone", allowNull: true },
        email: { type: Sequelize.STRING(255), field: "email", allowNull: true },
        contact_type: {
          type: Sequelize.TEXT,
          field: "contact_type",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_departments",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: true,
        },
        act_required: {
          type: Sequelize.BOOLEAN,
          field: "act_required",
          allowNull: true,
        },
        min_act_score: {
          type: Sequelize.INTEGER,
          field: "min_act_score",
          allowNull: true,
        },
        sat_required: {
          type: Sequelize.BOOLEAN,
          field: "sat_required",
          allowNull: true,
        },
        min_sat_score: {
          type: Sequelize.INTEGER,
          field: "min_sat_score",
          allowNull: true,
        },
        diploma_required: {
          type: Sequelize.BOOLEAN,
          field: "diploma_required",
          allowNull: true,
        },
        gpa_requirement: {
          type: Sequelize.INTEGER,
          field: "gpa_requirement",
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: true,
        },
        name: { type: Sequelize.TEXT, field: "name", allowNull: true },
        major_type_id: {
          type: Sequelize.INTEGER,
          field: "major_type_id",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_extracurriculars",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          allowNull: true,
        },
        extracurricular_activity_id: {
          type: Sequelize.INTEGER,
          field: "extracurricular_activity_id",
          references: { model: "extracurriculars", key: "id" },
          allowNull: true,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          field: "is_active",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "school_social_medias",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: true,
        },
        social_media: {
          type: Sequelize.STRING(255),
          field: "social_media",
          allowNull: true,
        },
        url: { type: Sequelize.STRING(255), field: "url", allowNull: true },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "applicants",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        student_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          field: "student_id",
          references: { model: "students", key: "id" },
          allowNull: false,
        },
        school_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: false,
        },
        recruiter_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          field: "recruiter_id",
          references: { model: "recruiters", key: "id" },
          allowNull: false,
        },
        applicant_status: {
          type: Sequelize.TEXT,
          field: "applicant_status",
          allowNull: false,
        },
        application_status: {
          type: Sequelize.TEXT,
          field: "application_status",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "recruits",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        student_id: {
          type: Sequelize.INTEGER,
          field: "student_id",
          references: { model: "students", key: "id" },
          allowNull: true,
        },
        recruiter_id: {
          type: Sequelize.INTEGER,
          field: "recruiter_id",
          references: { model: "recruiters", key: "id" },
          allowNull: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          references: { model: "schools", key: "id" },
          allowNull: true,
        },
        criteria: { type: Sequelize.TEXT, field: "criteria", allowNull: true },
        contacted: {
          type: Sequelize.BOOLEAN,
          field: "contacted",
          allowNull: true,
        },
        create_date: {
          type: Sequelize.DATE,
          field: "create_date",
          allowNull: true,
        },
        interested: {
          type: Sequelize.BOOLEAN,
          field: "interested",
          allowNull: true,
        },
        connection_initiator: {
          type: Sequelize.TEXT,
          field: "connection_initiator",
          allowNull: true,
        },
        connection_date: {
          type: Sequelize.DATE,
          field: "connection_date",
          allowNull: true,
        },
        is_viewable: {
          type: Sequelize.BOOLEAN,
          field: "is_viewable",
          allowNull: true,
        },
        application_date: {
          type: Sequelize.DATEONLY,
          field: "application_date",
          allowNull: true,
        },
        application_status: {
          type: Sequelize.STRING(255),
          field: "application_status",
          allowNull: true,
        },
        applicant_status: {
          type: Sequelize.STRING(255),
          field: "applicant_status",
          allowNull: true,
        },
        is_applicant: {
          type: Sequelize.BOOLEAN,
          field: "is_applicant",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "student_connections",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        student_id: {
          type: Sequelize.INTEGER,
          field: "student_id",
          references: { model: "students", key: "id" },
          allowNull: true,
        },
        school_id: {
          type: Sequelize.INTEGER,
          field: "school_id",
          allowNull: true,
        },
        status: {
          type: Sequelize.STRING(255),
          field: "status",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "student_department_interests",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        student_id: {
          type: Sequelize.INTEGER,
          field: "student_id",
          references: { model: "students", key: "id" },
          allowNull: true,
        },
        department_id: {
          type: Sequelize.INTEGER,
          field: "department_id",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "student_extracurriculars",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        student_id: {
          type: Sequelize.INTEGER,
          field: "student_id",
          references: { model: "students", key: "id" },
          allowNull: false,
        },
        extracurricular_id: {
          type: Sequelize.INTEGER,
          field: "extracurricular_id",
          allowNull: false,
        },
        activity_type: {
          type: Sequelize.STRING(50),
          field: "activity_type",
          allowNull: true,
        },
        high_school_activity: {
          type: Sequelize.BOOLEAN,
          field: "high_school_activity",
          defaultValue: false,
          allowNull: true,
        },
        college_activity: {
          type: Sequelize.BOOLEAN,
          field: "college_activity",
          defaultValue: false,
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["accreditations", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["amenities", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["applicants", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["assets", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["departments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["extracurriculars", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["managers", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["messages", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["notes", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["opt_out_logs", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["phones", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["recruiter", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["recruiters", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["recruiter_states", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["recruits", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_accreditations", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_addresses", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_amenities", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_contacts", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_departments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_extracurriculars", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_form_history", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_forms_history", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_images", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_research_programs", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["schools", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["school_social_medias", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["student_connections", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["student_department_interests", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["student_extracurriculars", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["students", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
