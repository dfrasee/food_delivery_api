import IRestaurant, { RestaurantModel } from '../model/Restaurant';
import { Types } from 'mongoose';
//import User from '../model/User';



export class RestaurantRepo {

  public static getAllRestaurants(): Promise<IRestaurant | null> {
    return RestaurantModel.find().lean<IRestaurant>().exec();
  }

  public static getTopRestaurantsByOptions(limit: number, dishCount: number, beginPrice: number, endPrice: number): Promise<IRestaurant | null> {
    return RestaurantModel.find({"menu.price": { $gte: beginPrice, $lte: endPrice}})
            .limit(limit)
            .lean<IRestaurant>()
            .exec();           
  }

  public static getTopRestaurantsByOptions2(limit: number, dishCount: number, beginPrice: number, endPrice: number): Promise<IRestaurant | null> {
    // const test = await RestaurantModel.aggregate( [ { $unwind: "$tags" },  { $sortByCount: "$tags" } ] );
    return null;
  }

  public static searchByName(searchString: string): Promise<IRestaurant|null> {

      return RestaurantModel.find( { $text: { $search : searchString } },{ score : { $meta: "textScore" } } )
            .sort( {score: { $meta : "textScore" } } )
            .lean<IRestaurant>()
            .exec();
  }



  public static isOpening(stringDatetime: string|null, openingHours: string) : boolean {
    var certainDatetime = new Date();
    if(stringDatetime){
      certainDatetime =  new Date(stringDatetime);
    }
    let listDays: string[] = ["Sun","Mon", "Tues","Weds","Thurs","Fri","Sat"];
    let dayToCheck = listDays[certainDatetime.getDay()];
    let timeToCheck = certainDatetime.toTimeString().substr(0,5);
    let openHours = openingHours;
    let openDatetime: string[] = openHours.split(' / ');
    let isOpen = false;
    //console.log('dayToCheck', dayToCheck);
    //console.log('timeToCheck', timeToCheck);
    for(let datetimeStr of openDatetime) {
        let index = datetimeStr.search(/[0-9]/);
        let openTime = datetimeStr.substring(index);
        let openDay = datetimeStr.substring(0,index).trim();
        let isTimeMatch = this.checkTime(openTime,timeToCheck);
        //console.log('date', datetimeStr);
        //console.log('open_day', openDay);
        //console.log('open_time', openTime);
        //console.log('isTimeMatch', isTimeMatch);
        if(isTimeMatch) {
            if(openDay.trim() == dayToCheck || openDay.indexOf(dayToCheck) !== -1) {
                isOpen = true;
                break;
            }else if(openDay.indexOf('-') !== -1) {      	
                let rangeDay = openDay.split(' - ');            
                if(rangeDay.length>2){
                    let rangeDayGroup = openDay.split(',');
                    for(let ranges of rangeDayGroup) {
                        if(ranges.indexOf('-') !== -1) {
                            let range = ranges.split(' - ');
                            let beginDay = range[0].trim();
                            let endDay = range[1].trim();
                            if(this.checkDate(listDays, dayToCheck, beginDay, endDay)){
                                isOpen = true;
                                break;
                            }
                        }            
                    }
                    
                }else{
                    let rangeDay0 = rangeDay[0].split(',');
                    let rangeDay1 = rangeDay[1].split(',');
                    let beginDay = rangeDay0[rangeDay0.length-1].trim();
                    let endDay = rangeDay1[0].trim();
                    if(this.checkDate(listDays, dayToCheck, beginDay, endDay)){
                        isOpen = true;
                        break;
                    }
                }
            }
        }
    }
    return isOpen? true : false;
  }

  private static checkTime(openTime: string, timeToCheck: string) : boolean {
      let time = openTime.split(' - ');
      let startTime = this.convertTime(time[0].trim());
      let endTime = this.convertTime(time[1].trim());
      return ((timeToCheck >= startTime && timeToCheck <= endTime) || (timeToCheck >= startTime && startTime > endTime));
  }

  private static  checkDate(days: string[], dayToCheck: string, beginDay: string, endDay: string) : boolean {
    return (days.indexOf(dayToCheck) >= days.indexOf(beginDay) && days.indexOf(dayToCheck) <= days.indexOf(endDay) || ((days.indexOf(dayToCheck) <= days.indexOf(endDay)) &&  days.indexOf(beginDay) > days.indexOf(endDay)));
  }

  private static convertTime(time: string): string {
      var hours = Number(time.match(/^(\d+)/)[1]);
      var minutes = (time.indexOf(':')!==-1)? Number(time.match(/:(\d+)/)[1]) : 0;
      var AMPM = time.match(/\s(.*)$/)[1].toUpperCase();
      if(AMPM == "PM" && hours<12) hours = hours+12;
      // if(AMPM == "PM" && hours==12) hours = hours-12;
      var sHours = hours.toString();
      var sMinutes = minutes.toString();
      if(hours<10) sHours = "0" + sHours;
      if(minutes<10) sMinutes = "0" + sMinutes;
      return sHours + ":" + sMinutes;
  }

}
