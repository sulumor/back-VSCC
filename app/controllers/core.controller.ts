export default class CoreController {
  static datamapper: {
    findAll: () => any;
    findByPk: (arg0: any) => any;
    insert: (arg0: any) => any;
    update: (arg0: any, arg1: any) => any;
    delete: (arg0: any) => any;
  };

  static async getAll(
    _: any,
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: any): any; new (): any };
      };
    }
  ) {
    const rows = await this.datamapper.findAll();
    return res.status(200).json(rows);
  }

  static async getByPk(
    { params }: any,
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: any): any; new (): any };
      };
    },
    next: () => any
  ) {
    const { id } = params;
    const row = await this.datamapper.findByPk(id);
    if (!row) return next();
    return res.status(200).json(row);
  }

  static async create(
    { body }: any,
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: any): any; new (): any };
      };
    }
  ) {
    const row = await this.datamapper.insert(body);
    return res.status(200).json(row);
  }

  static async update(
    { params, body }: any,
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: any): any; new (): any };
      };
    },
    next: () => any
  ) {
    const { id } = params;
    const row = await this.datamapper.update(id, body);
    if (!row) return next();
    return res.status(200).json(row);
  }

  static async delete(
    { params }: any,
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        end: { (): any; new (): any };
      };
    },
    next: () => any
  ) {
    const { id } = params;
    const deleted = await this.datamapper.delete(id);
    if (!deleted) return next();
    return res.status(204).end();
  }
}
