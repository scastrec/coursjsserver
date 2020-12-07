import express from  'express';
import http from 'http';

import {configExpress} from './src/handlers.js';

var app = express();

const httpSrv = http.Server(app);
configExpress(app);

httpSrv.listen(8080, function () {
    console.log('listening on *:8080');
});
