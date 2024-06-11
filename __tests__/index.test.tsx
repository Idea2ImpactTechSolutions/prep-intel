/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";
import SchoolDashboard from "@/app/school/[id]/dashboard/page"
import * as managerApi from "@/redux/services/school/managerApi"; // Import the whole module

jest.mock("next/navigation", () => ({
  useRouter() {
      return {
          route: "/",
          pathname: "",
          query: "",
          asPath: "",
      };
  },
  useParams() {
    return {
      id: 123456,
    }
  },
  usePathname() {
    return "/";
  }
}));

jest.mock("next/router", () => ({
  useRouter() {
      return {
          route: "/",
          pathname: "",
          query: "",
          asPath: "",
      };
  },
}));

jest.mock("next-auth/react", () => ({
  useSession() {
    return {}
  }
}));

// Mock the data fetching hook
jest.mock("../redux/services/school/managerApi");


describe("Home", () => {
  it("renders a heading", () => {
    render(<Page/>);

    const button = screen.getByText("Send a Message");
    expect(button).toBeInTheDocument();
  });
});

describe("School Dashboard", () => {
  beforeEach(() => {
    // Provide a mock implementation for the hook
    jest.spyOn(managerApi, 'useGetSchoolMetricsQuery').mockReturnValue({
      data: {
        totalRecruits: 100,
        pendingApplicants: 10,
        admittedStudents: 60,
        schoolAdmissionConversionRate: 0.6,
        enrolledStudents: 50,
        applicationGrowthRate: 5.7,
      },
      isLoading: false,
      error: null,
    });
  });
  it("renders a heading", () => {
    render(<SchoolDashboard/>);
    const heading = screen.getByText("My Dashboard");
    expect(heading).toBeInTheDocument();
  });
});