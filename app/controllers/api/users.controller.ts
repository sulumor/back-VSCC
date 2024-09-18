import CoreController from "../core.controller";
import UsersDatamapper from "@/datamapper/users.datamapper";

export default class UsersController extends CoreController {
  static datamapper = UsersDatamapper;
}
