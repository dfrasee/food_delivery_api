import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import { ApiRoutes } from "./routes/api";
import * as swaggerUi from "swagger-ui-express";
import fs = require('fs');
import * as dotenv from 'dotenv';
dotenv.config();
class App {

    public app: express.Application;
    public apiRoute: ApiRoutes = new ApiRoutes();
    public mongoUrl: string = process.env.DB_CONN_STRING;
    
    /* Swagger files start */
    private swaggerFile: any = (process.cwd()+"/src/docs/swagger.json");
    private swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
    private customCss: any = fs.readFileSync((process.cwd()+"/src/docs/swagger.css"), 'utf8');
    private swaggerDocument = JSON.parse(this.swaggerData);
    /* Swagger files end */

    constructor() {
        this.app = express();
        this.config();
        this.apiRoute.routes(this.app);
        this.swaggerRoute();
        this.databaseSetup(); 
      
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private databaseSetup(): void{
        mongoose.connect(this.mongoUrl)
        .then(res => { console.log('mongodb connected') })
        .catch(err => { console.log('mongo error in connection:', err) });
    }

    private swaggerRoute(): void{
        this.app.use('/api/docs', swaggerUi.serve,
        swaggerUi.setup(this.swaggerDocument, null, null, this.customCss));
    }
}

export default new App().app;