import JWTService from "./jwt.service";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");
jest.mock("../datamapper/users.datamapper");

describe("JWTService", () => {
  let jwtService: JWTService;
  let mockUser: any;

  beforeEach(() => {
    jwtService = new JWTService();
    mockUser = {
      id: 1,
      firstname: "John",
      is_admin: true,
    };
  });

  describe(" fonction createAccessToken", () => {
    it("doit créer un access token correct", () => {
      const token = "mockedToken";
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const accessToken = jwtService.createAccessToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          firstname: mockUser.firstname,
          is_admin: mockUser.is_admin,
        },
        expect.any(String),
        { expiresIn: 20 }
      );
      expect(accessToken).toBe(token);
    });
  });

  describe("fonction createRefreshToken", () => {
    it("doit créer un refresh token correct", () => {
      const token = "mockedRefreshToken";
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const refreshToken = jwtService.createRefreshToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id },
        expect.any(String),
        {
          expiresIn: "1 days",
        }
      );
      expect(refreshToken).toBe(token);
    });
  });
});
