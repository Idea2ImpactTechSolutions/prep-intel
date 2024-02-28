/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";
import SchoolDashboard from "@/app/school/(routes)/dashboard/page"

jest.mock("next/navigation", () => ({
  useRouter() {
      return {
          route: "/",
          pathname: "",
          query: "",
          asPath: "",
      };
  },
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

describe("Home", () => {
  it("renders a heading", () => {
    render(<Page/>);

    const heading = screen.getByText("Welcome to Prep Intel");
    expect(heading).toBeInTheDocument();
  });
});

describe("School Dashboard", () => {
  it("renders a heading", () => {
    render(<SchoolDashboard/>);

    const heading = screen.getByText("My Dashboard");
    expect(heading).toBeInTheDocument();
  });
});