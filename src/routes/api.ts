import {Request, Response} from "express";
import { ApiController } from "../controllers/api";

export class ApiRoutes {

    public apiController = new ApiController();

    public routes(app): void {
        app.route('/api/get_opening_restaurants').post(this.apiController.getRestaurants);
        app.route('/api/get_top_restaurants').post(this.apiController.getTopRestaurants);
        app.route('/api/search').post(this.apiController.search);
        app.route('/api/purchase').post(this.apiController.purchase);
    }

}