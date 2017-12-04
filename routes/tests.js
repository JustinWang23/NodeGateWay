var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads/"))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var limits = {
	fields: 10,
	fileSize: 5*1024*1024,
	files: 5
}

function fileFilter (req, file, cb) {

  if (file.originalname.indexOf('.jpg') > -1) {
  	// 拒绝这个文件，使用`false`，像这样:
  	cb(null, false)
  	// 如果有问题，你可以总是这样发送一个错误:
  	cb(new Error('No JPG File!'))
  } else {
  	// 接受这个文件，使用`true`，像这样:
  	cb(null, true)
  }

}

var upload = multer({ storage: storage, limits: limits, fileFilter: fileFilter })

// 引入模块
var ModelProxy = require( 'modelproxy-copy' );
ModelProxy.init( path.resolve(__dirname, '../configs/interface.json') );

// 更多创建方式，请参考后文API
var model = new ModelProxy( 'Test.*' );

/* GET test listing. */
router.get("/get/:id/", function (req, res, next) {

	model.get( { id: req.params.id } )
	    .done( function( data ) {
	        res.status(200).json({data: data})
	    } )
	    .error( function( err ) {
        	console.log( err );
    	} );
});

router.get("/getFile/:filename", function (req, res, next) {
	res.sendFile( path.resolve(__dirname, "../uploads/"+req.params.filename), function (err) {
		next(err)
	} )
});

router.post("/uploadFile", upload.single('thumbnail'), function (req, res, next) {

	res.send('File uploaded to: ' + req.file.path + ' - ' + req.file.size + ' bytes');
});

router.get("/test.html", function (req, res, next) {
	res.render('test');
});

router.get("/:user/:gender", function (req, res, next) {
	var params = req.params;

	// 合并请求
	model.get( { gender: params.gender } )
		.post( { name: params.user } )
	    .done( function( data1, data2 ) {
	        res.status(200).json( { data1: data1, data2: data2 } )
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

module.exports = router;
