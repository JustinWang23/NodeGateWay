var express = require('express');
var router = express.Router();
var path = require('path');

// 引入模块
var ModelProxy = require( 'modelproxy-copy' );
ModelProxy.init( path.resolve(__dirname, '../config/interface.json') );

// 更多创建方式，请参考后文API
var model = new ModelProxy( 'Test.*' );

/* GET test listing. */
router.get("/:user/:gender", function (req, res, next) {
	var params = req.params;

	// 合并请求
	model.get( { gender: params.gender } )
		.post( { name: params.user} )
	    .done( function( data1, data2 ) {
	        res.status(200).json({data1: data1,data2: data2})
	    } )
	    .error( function( err ) {
        	console.log( err );
    	} );
});

router.get("/:user/", function (req, res, next) {
	var params = req.params;

	// 合并请求
	model.post( { name: params.user} )
	    .done( function( data ) {
	        res.status(200).json({data: data})
	    } )
	    .error( function( err ) {
        	console.log( err );
    	} );
});

router.get("/get/:id/:user", function (req, res, next) {

	model.get( { id: req.params.id } )
	    .done( function( data ) {
	        res.status(200).json({data: data})
	    } )
	    .error( function( err ) {
        	console.log( err );
    	} );
});

module.exports = router;
