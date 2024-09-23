import JWTService from "./jwt.service";
import jwt from "jsonwebtoken";
import UsersDatamapper from "../datamapper/users.datamapper";
import { Response, NextFunction } from "express";
import ApiError from "../errors/api.error";

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
      email: "john@example.com",
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
          email: mockUser.email,
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
          expiresIn: "14 days",
        }
      );
      expect(refreshToken).toBe(token);
    });
  });

  describe("fonction haveNewAccessToken", () => {
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it("should return a new access token when refresh token is valid", async () => {
      const refreshToken = "validRefreshToken";
      const payload = { id: 1 };
      const user = {
        id: 1,
        firstname: "John",
        email: "john@example.com",
        is_admin: true,
      };

      (jwt.verify as jest.Mock).mockImplementation((token, secret, cb) => {
        cb(null, payload); // Simule la validité du token
      });
      (UsersDatamapper.findByPk as jest.Mock).mockResolvedValue(user);

      await jwtService.haveNewAccessToken(
        refreshToken,
        mockRes as Response,
        mockNext
      );

      expect(UsersDatamapper.findByPk).toHaveBeenCalledWith(payload.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        accessToken: expect.any(String),
      });
    });

    it("should return 403 when refresh token is invalid", async () => {
      const refreshToken = "invalidRefreshToken";
      const error = new Error("Invalid token");

      (jwt.verify as jest.Mock).mockImplementation((token, secret, cb) => {
        cb(error, null);
      });

      await jwtService.haveNewAccessToken(
        refreshToken,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        new ApiError(error.message, { httpStatus: 403 })
      );
    });

    it("should return 404 if no user is found", async () => {
      const refreshToken = "validRefreshToken";
      const payload = { id: 1 };

      (jwt.verify as jest.Mock).mockImplementation((token, secret, cb) => {
        cb(null, payload);
      });
      (UsersDatamapper.findByPk as jest.Mock).mockResolvedValue(null); // Simule l'absence d'utilisateur

      await jwtService.haveNewAccessToken(
        refreshToken,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        new ApiError("Aucun utilisateur de trouvé", { httpStatus: 404 })
      );
    });
  });
});
