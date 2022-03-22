import * as mongoose from 'mongoose';
import { RestaurantRepo } from '../database/repository/RestaurantRepo';
import { UserModel } from '../database/model/User';
import { RestaurantModel } from '../database/model/Restaurant';
import { Request, Response } from 'express';
import IRestaurant from '../database/model/Restaurant';

// const Restaurant = mongoose.model('restaurants', RestaurantSchema);
export class ApiController {
    public getRestaurants (req: Request, res: Response) {
        const allRestaurants = RestaurantRepo.getAllRestaurants();
        var i =0;
        allRestaurants.then(function(restaurant) {
            let strDatetime = req.body.strDatetime?req.body.strDatetime:null;
            let openingRestaurants : any = [];
            // var key = 0;
            for (let i in restaurant) {
                let isOpening = RestaurantRepo.isOpening(strDatetime, restaurant[i].openingHours);
                //  console.log('index', i);
                //  console.log('isOpening', isOpening);
                if(isOpening) {
                //     delete restaurant[i];
                // }else{
                    delete restaurant[i]['menu'];
                    delete restaurant[i]['cashBalance'];
                    openingRestaurants.push(restaurant[i]);
                }
            }

             res.json((openingRestaurants)); 
            //return res.send(restaurant);              
        });
    }

    public getTopRestaurants(req: Request, res: Response) {
        let limit = parseInt(req.body.limit);
        let dishCount = req.body.dishCount;
        let fromPrice = parseFloat(req.body.fromPrice);
        let toPrice = parseFloat(req.body.toPrice);

         const restaurants = RestaurantRepo.getTopRestaurantsByOptions(limit,dishCount,fromPrice,toPrice);
         restaurants.then(function(restaurant) {
                 res.json((restaurant)); 
         });

        
    }

    public search(req: Request, res: Response) {
        let searchTerm = req.body.searchTerm;
        if(searchTerm && searchTerm.length > 1) {
            const restaurants = RestaurantRepo.searchByName(searchTerm);
            restaurants.then(function(restaurant) {
                 res.json((restaurant)); 
            });

        }else{
            res.json({}); 
        }
    }

    public purchase(req: Request, res: Response) {
        let userId = req.body.userId;
        let restaurantName:string = req.body.restaurantName;
        let dishName:string  = req.body.dishName;
        let price:number  = req.body.price;
        const user = UserModel.findOne({id: userId });
        user.then(function(userDocument) {
            if(userDocument.cashBalance>=price) {
                let today = new Date();
                let d = today.getDate();
                let m = (today.getMonth()+1); 
                const yyyy = today.getFullYear();
                let dd = d.toString();
                let mm = m.toString();
                if(d<10) dd=`0${d}`;
                if(m<10) mm=`0${m}`;
                let purchaseDate = `${mm}/${dd}/${yyyy}`;
                let purchaseDateTime:string = purchaseDate+' '+today.toTimeString().substr(0,5)+' '+today.toLocaleTimeString().slice(-2);
                let purchaseData = {
                    "restaurantName": restaurantName,
                    "dishName": dishName,
                    "transactionAmount": price,
                    "transactionDate": purchaseDateTime
                }
                //add purchase history
                userDocument.purchaseHistory.push(purchaseData);
                //deduct user cashBalance
                userDocument.cashBalance = (userDocument.cashBalance-price);
                userDocument.save();
                const restaurant = RestaurantModel.findOne({restaurantName: restaurantName});
                restaurant.then(function(restaurantDocument) {
                    //add restaurant balanace
                    let balance = (restaurantDocument.cashBalance/1)+(price/1);
                    restaurantDocument.cashBalance = balance;
                    restaurantDocument.save();
                    res.json(
                        {
                        "statusCode":"0",
                        "message":"Purchase Successful",
                        "user":userDocument,
                        "restaurant": restaurantDocument
                    });
                });
            }else{
                res.json({"statusCode":"100","message":"Insufficial balance"}); 
            }
        });
    }
}