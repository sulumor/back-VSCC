import CoreDatamapper from "./core.datamapper";

export default class UsersDatamapper extends CoreDatamapper {
  static tableName = "user";
  static insertTable = "add_user";
  static updateTable = "update_user";
}
