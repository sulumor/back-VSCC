import type { Traces, Trace } from "@/@Types/traces.types";
import client from "../helpers/pg.client";

export default class CoreDatamapper {
  static tableName: string;
  static insertTable: string;
  static updateTable: string;

  static async findAll(): Promise<Traces> {
    const result = await client.query(`SELECT * FROM "${this.tableName}"`);
    return result.rows;
  }

  static async findByPk(id: string): Promise<Trace> {
    const result = await client.query(
      `SELECT * FROM "${this.tableName}" WHERE id=$1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByParams(params: { where: any }): Promise<Traces> {
    let filter = "";
    const values: unknown[] = [];

    if (params.where) {
      const filters: string[] = [];
      let indexPlaceholder = 1;

      Object.entries(params.where).forEach(([param, value]: [string, any]) => {
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

  static async insert(data: Partial<Trace>): Promise<Trace> {
    const result = await client.query(`SELECT * FROM ${this.insertTable}($1)`, [
      data,
    ]);
    return result.rows[0];
  }

  static async update(data: Partial<Trace>): Promise<Trace> {
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
