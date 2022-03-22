# Food Delivery API
#### This project is to practice my coding with typescript

### Installation
> $git clone https://github.com/dfrasee/food_delivery_api.git
>
> $cd food_delivery_api

This project used MongoDB so you can setup your data base and import raw data with json files in folder 'data' into your database.

Change .env.sameple file to .env then edit value.

Ensure you have install Node.js on your server [see more](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install Node.js

Now setup project
> $npm install 

To test dev 
> $ts-node ./src/server.ts
> 
To deploy prod 
> $npm run build && npm run start

This will ready service on your host, for example if you localhost then will be  http://localhost:<your_port>/api/docs

See [demo](https://noi-food-delivery.herokuapp.com/api/docs) for my project

### TODO
- Need to extract data 'menu' in restaurant to new document to be improve seach efficiance 
- Some code need be improve to be ES6
