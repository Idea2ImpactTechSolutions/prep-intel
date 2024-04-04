/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";
import SchoolDashboard from "@/app/school/[id]/dashboard/page"

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

describe("Home", () => {
  it("renders a heading", () => {
    render(<Page/>);

    const button = screen.getByText("Send a Message");
    expect(button).toBeInTheDocument();
  });
});

describe("School Dashboard", () => {
  it("renders a heading", () => {
    render(<SchoolDashboard/>);

    const heading = screen.getByText("My Dashboard");
    expect(heading).toBeInTheDocument();
  });
});