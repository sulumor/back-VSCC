import CoreDatamapper from "./core.datamapper";

export default class TracesDatamapper extends CoreDatamapper {
  static tableName = "trace";
  static insertTable = "add_trace";
  static updateTable = "update_trace";
}
