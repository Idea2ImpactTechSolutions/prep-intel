/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Page from "@/app/(login)/login/page";
import React from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const ROLE_ROUTE_MAPPER = {
  "admin": "/admin/school",
  "manager": "school/123456/dashboard",
  "recruiter": "/recruiter/profile/welcome",
  "student": "/student/explore"
};
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));


describe("Login Page", () => {
    it("renders a heading", () => {
      (useSession as jest.Mock).mockReturnValueOnce({})
      render(<Page/>);
  
      const button = screen.getByText("Sign In");
      expect(button).toBeInTheDocument();
    });

    it('redirects to the correct route for various roles', () => {
      const mockRouterPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
      const useStateMock = jest.spyOn(React, 'useState');
      for (const [key, value] of Object.entries(ROLE_ROUTE_MAPPER)) {
        (useSession as jest.Mock).mockReturnValue({ data: { user: {role: key, schoolID: 123456 }}, status: 'authenticated' });
        useStateMock.mockReturnValueOnce([false, jest.fn()]);
        useStateMock.mockReturnValueOnce([false, jest.fn()]);
        useStateMock.mockReturnValueOnce([true, jest.fn()]);
        render(<Page />);
        expect(mockRouterPush).toHaveBeenLastCalledWith(value);

      }
    });
  });