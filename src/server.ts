import app from "./app";
const port = '8088';//process.env.PORT;

app.listen(port, () => {
    console.log('API server listening on port ' + port);
})