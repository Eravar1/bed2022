// name: grace tay 
// class: DAAA/1B/01
// admin number: 2109927

var jwt = require('jsonwebtoken');
require('dotenv').config();
var config = process.env.JWT_SECRET;

function verifyToken(req, res, next){
    var token = req.headers['authorization']; //retrieve authorization header's content
    if(!token || !token.includes('Bearer')){ //process the token
       res.status(403);
       return res.send({auth:'false', message:'Not authorized!'});
    }else{
       token=token.split('Bearer ')[1]; //obtain the token's value
       jwt.verify(token, config, function(err, decoded){ //verify token
        if(err){
            res.status(403);
            return res.end({auth:false, message:'Not authorized!'});
        }else{
            req.userid=decoded.id; //decode the userid and store in req for use
            next();
        }
       });
    }
}

module.exports = verifyToken;