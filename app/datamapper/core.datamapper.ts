import client from "../helpers/pg.client";

export default class CoreDatamapper {
  static tableName: any;

  static insertTable: any;

  static updateTable: any;

  static async findAll() {
    const result = await client.query(`SELECT * FROM "${this.tableName}"`);
    return result.rows;
  }

  static async findByPk(id: any) {
    const result = await client.query(
      `SELECT * FROM "${this.tableName}" WHERE id=$1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByParams(params: { where: any }) {
    let filter = "";
    const values: unknown[] = [];

    if (params.where) {
      const filters: string[] = [];
      let indexPlaceholder = 1;

      Object.entries(params.where).forEach(([param, value]) => {
        if (param === "or") {
          const filtersOr: string[] = [];
          Object.entries(value).forEach(([key, val]) => {
            filtersOr.push(`"${key}" = $${indexPlaceholder}`);
            values.push(val);
            indexPlaceholder += 1;
          });
          filters.push(`(${filtersOr.join(" OR ")})`);
        } else {
          filters.push(`"${param}" = $${indexPlaceholder}`);
          values.push(value);
          indexPlaceholder += 1;
        }
      });
      filter = `WHERE ${filters.join(" AND ")}`;
    }
    const result = await client.query(
      `SELECT * FROM "${this.tableName}" ${filter}`,
      values
    );
    return result.rows;
  }

  static async insert(data: any) {
    const result = await client.query(`SELECT * FROM ${this.insertTable}($1)`, [
      data,
    ]);
    return result.rows[0];
  }

  static async update(data: any) {
    const result = await client.query(`SELECT * FROM ${this.updateTable}($1)`, [
      data,
    ]);
    return result.rows[0];
  }

  static async delete(id: any) {
    const result = await client.query(
      `DELETE FROM "${this.tableName}" WHERE "id" = $1`,
      [id]
    );
    return !!result.rowCount;
  }
}
