import { Request, Response, NextFunction } from "express";
import type { Trace, Traces } from "@/@Types/traces.types";
import type { User, Users } from "@/@Types/users.types";
import ApiError from "@/errors/api.error";

export default class CoreController {
  static datamapper: {
    findAll: () => Promise<Traces | Users>;
    findByPk: (id: string) => Promise<Trace | User>;
    findByParams: (params: { where: any }) => Promise<Traces | Users>;
    insert: (data: Partial<Trace | User>) => Promise<Trace | User>;
    update: (data: Partial<Trace | User>) => Promise<Trace | User>;
    delete: (id: string) => Promise<boolean>;
  };

  static async getAll(req: Request, res: Response, next: NextFunction) {
    let rows =
      Object.keys(req.query).length === 0
        ? await this.datamapper.findAll()
        : await this.datamapper.findByParams({ where: req.query });

    if (!rows[0])
      return next(new ApiError("Ressources non trouvées", { httpStatus: 404 }));
    return res.status(200).json(rows);
  }

  static async getByPk({ params }: Request, res: Response, next: NextFunction) {
    const { id } = params;
    const row = await this.datamapper.findByPk(id);
    if (!row)
      return next(new ApiError("Ressource non trouvée", { httpStatus: 404 }));
    return res.status(200).json(row);
  }

  static async create({ body }: Request, res: Response, next: NextFunction) {
    const row = await this.datamapper.insert(body);
    if (!row)
      return next(new ApiError("Ressource non trouvée", { httpStatus: 404 }));
    return res.status(200).json(row);
  }

  static async update(
    { params, body }: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = params;
    const row = await this.datamapper.update({ id, ...body });
    if (!row)
      return next(new ApiError("Ressource non trouvée", { httpStatus: 404 }));
    return res.status(200).json(row);
  }

  static async delete({ params }: Request, res: Response, next: NextFunction) {
    const { id } = params;
    const deleted = await this.datamapper.delete(id);
    if (!deleted)
      return next(new ApiError("Ressource non trouvée", { httpStatus: 404 }));
    return res.status(204).end();
  }
}
