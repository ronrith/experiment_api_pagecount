var express = require('express');
var router = express.Router();

/* MongoDB Connection*/
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = 'mongodb://localhost:27017/dbtrack';
var mainDb;
MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");
  mainDb = db;
});


/* API Route */
router.get('/api/track/:tag', function(req, res, next) {
   
  var collection = mainDb.collection('tracker');
  var d = new Date();
  var sTag = req.params['tag'];
  var sDate = d.toLocaleDateString();
  var sDate = "3/10/2016";
  var iHour = d.getHours();
  var iHour = 8;

  /* Check if Date/Tag exist*/
  collection.find({tag: sTag, date: sDate}).toArray(function(err,result){
  	/* Create Document if not exists*/
  	if (result.length==0){
  		collection.insert({tag: sTag, date: sDate, hourly: [{hour: iHour, count:1}]},function(err, result){res.send(result);})
  	}else{
  		/* Check for Hour in Array */
  		collection.find({tag: sTag, date: sDate, "hourly.hour": iHour}).toArray(function(err,result){
  			if (result.length==0){
  				/* Hour does not exist, Insert Hour*/
  				collection.update({tag: sTag, date: sDate}, {$push: {hourly: {"hour": iHour, "count": 1}}}, function(err,result){res.send(result);})
  			}else{
  				/* Increment Count by 1 */
  				collection.update({tag: sTag, date: sDate, "hourly.hour": iHour}, {$inc: {"hourly.$.count": 1}}, function(err,result){res.send(result);});
  			}
  		})
  	}
  })
});

router.get('/api/stats/', function(req, res, next) {
	var collection = mainDb.collection('tracker');
	collection.find({}).sort({_id:-1}).toArray(function(err,result){
		res.send(result);
	});
});





// router.get('/api/insert/:tag', function(req, res, next) {
//   var collection = mainDb.collection('documents');
//   // Insert some documents 
//   collection.insert({tag: req.params['tag'], stat:[{hour: 21, count: 2}]}, function(err, result){
//   	console.log(result);
//   	collection.updateOne({tag: req.params['tag']},{ $set: { time : Date.now()} }, function(err,result){
//   		res.send(result);
//   	});
//   })
//   // res.render('index', { title: 'Express' });
// });

// router.get('/api/delete/:tag', function(req, res, next) {
//   var collection = mainDb.collection('documents');
//   // Insert some documents 
//   collection.remove({tag: req.params['tag']}, function(err,result){
//   	res.send(result);
//   })
//   // res.render('index', { title: 'Express' });
// });





module.exports = router;
