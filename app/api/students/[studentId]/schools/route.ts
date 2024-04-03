import { responseBody } from "app/config/helpers";

/**
 * @openapi
 * /api/students/{studentId}/schools:
 *   get:
 *       responses:
 *           '200':
 *               content:
 *                    application/json:
 *                       schema:
 *                           type: array
 *                           items: {}
 *       summary: Retrieves a list of student school interests
 */
export async function GET(req: Request) {
  try {
    const jsonBody = await req.json();
    const studentSchools: any = await getStudentSchools(jsonBody);
    if (!studentSchools) {
      return Response.json(
        responseBody("School interests not found", 404, null),
        {
          status: 404,
        }
      );
    }
    return Response.json(
      responseBody(
        "School interests retrieved successfully",
        200,
        studentSchools
      )
    );
  } catch (error: any) {
    return Response.json(
      responseBody("Internal Server Error", 500, { error: error.message }),
      {
        status: 500,
      }
    );
  }
}

/**
 * @swagger
 * /api/students/{studentId}/schools:
 *   post:
 *     description: Returns the hello world
 *     summary: Creates a new recruiter
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function POST(req: Request) {
  try {
    // TODO: Implement
    return Response.json(responseBody("Not implemented", 501, null), {
      status: 501,
    });

    // Collect
    const jsonBody = await req.json();
    const updatedVitals: any = await updateStudentSchools(jsonBody);

    // Report
    if (!updatedVitals) {
      return Response.json(responseBody("Student not found", 404, null), {
        status: 404,
      });
    }

    // Return
    return Response.json(
      responseBody("School interests updated successfully", 201, null),
      {
        status: 201,
      }
    );
  } catch (error: any) {
    // Report
    return Response.json(
      responseBody("Internal Server Error", 500, { error: error.message }),
      {
        status: 500,
      }
    );
  }
}

async function getStudentSchools(json) {
  return;
}

async function updateStudentSchools(json) {
  return;
}
