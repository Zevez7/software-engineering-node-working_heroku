/**
 * @file Controller RESTful Web service API for tuits resource
 */
import { Request, Response, Express } from "express";

import TuitDao from "../daos/TuitDao";
import TuitControllerI from "../interfaces/tuit/TuitController";

/**
 * @class TuitController Implements RESTful Web service API for tuits resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /tuits to create a new tuit instance for
 *     a given user</li>
 *     <li>GET /tuits to retrieve all the tuit instances</li>
 *     <li>GET /tuits/:tid to retrieve a particular tuit instances</li>
 *     <li>GET /tuits/users/:uid/ to retrieve tuits for a given user </li>
 *     <li>PUT /tuits/:tid to modify an individual tuit instance </li>
 *     <li>DELETE /tuits/:tid to remove a particular tuit instance</li>
 * </ul>
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {TuitController} tuitController Singleton controller implementing
 * RESTful Web service API
 */
export default class TuitController implements TuitControllerI {
  private static tuitDao: TuitDao = TuitDao.getInstance();
  private static tuitController: TuitController | null = null;
  /**
   * Creates singleton controller instance
   * @param {Express} app Express instance to declare the RESTful Web service
   * API
   * @return TuitController
   */
  public static getInstance = (app: Express): TuitController => {
    if (TuitController.tuitController === null) {
      TuitController.tuitController = new TuitController();
      app.get("/tuits", TuitController.tuitController.findAllTuits);
      app.post("/tuits", TuitController.tuitController.createTuit);
      app.get(
        "/tuits/users/:uid/",
        TuitController.tuitController.findTuitsByUser
      );
      app.get("/tuits/:tid", TuitController.tuitController.findTuitById);
      app.delete("/tuits/:tid", TuitController.tuitController.deleteTuit);
      app.put("/tuits/:tid", TuitController.tuitController.updateTuit);
    }

    return TuitController.tuitController;
  };

  private constructor() {}

  /**
   * Find all tuits
   * @param {Request} req Represents request from client
   * @param {Response} res Represents response to client, including the
   * body formatted as JSON arrays containing the tuit objects
   */
  findAllTuits = (req: Request, res: Response) =>
    TuitController.tuitDao.findAllTuits().then((tuits) => res.json(tuits));

  /**
   * Find tuit by user id
   * an array of tuits.
   * @param {Request} req Represents request from client
   * @param {Response} res Represents response to client, including the
   * body formatted as JSON arrays containing the tuit objects
   */
  findTuitsByUser = (req: Request, res: Response) =>
    TuitController.tuitDao
      .findTuitsByUser(req.params.uid)
      .then((tuits) => res.json(tuits));

  /**
   * Find tuit by tuit id.
   * @param {Request} req Represents request from client, including path
   * parameter tid identifying the primary key of the tuit to be retrieved
   * @param {Response} res Represents response to client, including the
   * body formatted as JSON containing the tuit that matches the user ID
   */
  findTuitById = (req: Request, res: Response) =>
    TuitController.tuitDao
      .findTuitById(req.params.tid)
      .then((tuit) => res.json(tuit));

  /**
   * Create Tuit
   * @param {Request} req Represents request from client, including body
   * containing the JSON object for the new tuit to be inserted in the
   * database
   * @param {Response} res Represents response to client, including the
   * body formatted as JSON containing the new tuit that was inserted in the
   * database
   */
  createTuit = (req: Request, res: Response) =>
    TuitController.tuitDao.createTuit(req.body).then((tuit) => res.json(tuit));

  /**
   * Delete tuit by tuit id
   * @param {Request} req Represents request from client, including path
   * parameter tid identifying the primary key of the tuit to be removed
   * @param {Response} res Represents response to client, including status
   * on whether deleting a user was successful or not
   */
  deleteTuit = (req: Request, res: Response) =>
    TuitController.tuitDao
      .deleteTuit(req.params.tid)
      .then((status) => res.json(status));

  /**
   * Update tuit by tuit id.
   * @param {Request} req Represents request from client, including path
   * parameter tid identifying the primary key of the tuit to be modified
   * @param {Response} res Represents response to client, including status
   * on whether updating a tuit was successful or not
   */
  updateTuit = (req: Request, res: Response) =>
    TuitController.tuitDao
      .updateTuit(req.params.tid, req.body)
      .then((status) => res.json(status));
}
