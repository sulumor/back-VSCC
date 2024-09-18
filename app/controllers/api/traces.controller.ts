import CoreController from "../core.controller";
import TracesDatamapper from "@/datamapper/traces.datamapper";

export default class TracesController extends CoreController {
  static datamapper = TracesDatamapper;
}
