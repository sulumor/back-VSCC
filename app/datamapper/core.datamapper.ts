import type { Trace } from "@/@Types/traces.types";
import type { User } from "@/@Types/users.types";
import client from "../helpers/pg.client";

export default class CoreDatamapper {
  static tableName: string;
  static insertTable: string;
  static updateTable: string;

  static async findAll() {
    const result = await client.query(
      `SELECT * FROM "${this.tableName}" ORDER BY id`
    );
    return result.rows;
  }

  static async findByPk(id: string) {
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

      Object.entries(params.where).forEach(([param, value]: [string, any]) => {
        if (Array.isArray(value)) {
          if (param === "distance") {
            filters.push(`"${param}" >= $${indexPlaceholder}`);
            values.push(value[0]);
            indexPlaceholder += 1;
            filters.push(`"${param}" <= $${indexPlaceholder}`);
            values.push(value[1]);
            indexPlaceholder += 1;
          } else {
            const filtersOr: string[] = [];
            value.forEach((val) => {
              filtersOr.push(`"${param}" = $${indexPlaceholder}`);
              values.push(val);
              indexPlaceholder += 1;
            });
            filters.push(`(${filtersOr.join(" OR ")})`);
          }
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

  static async insert(data: Partial<Trace | User>) {
    const result = await client.query(`SELECT * FROM ${this.insertTable}($1)`, [
      data,
    ]);
    return result.rows[0];
  }

  static async update(data: Partial<Trace | User>) {
    const result = await client.query(`SELECT * FROM ${this.updateTable}($1)`, [
      data,
    ]);
    return result.rows[0];
  }

  static async delete(id: string): Promise<boolean> {
    const result = await client.query(
      `DELETE FROM "${this.tableName}" WHERE "id" = $1`,
      [id]
    );
    return !!result.rowCount;
  }
}
