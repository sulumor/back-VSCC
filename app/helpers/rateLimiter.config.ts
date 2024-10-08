import rateLimit from "express-rate-limit";

const Limiter = {
  base: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 100, // 100 requêtes par minute par IP
  }),
  accountLogin: rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: "Vous avez dépassé la limite de tentatives de connexion !",
  }),
  refreshToken: rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    message: "Vous avez dépassé la limite de tentatives de connexion !",
  }),
};

export default Limiter;
