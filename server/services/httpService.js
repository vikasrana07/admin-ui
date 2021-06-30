var request = require('request');
mode = process.env.NODE_ENV || 'dev';
const config = require('config').get(mode);
module.exports = {
  get: async (req, res, requestName, url) => {
    /* let myCustPromise = new Promise((resolve, reject) => {
		var result;
		let apiUrl = config.serverUrlWebUrlLink + url;
		request({
			url : apiUrl, 
		    method : 'GET',
		    headers : reqHeader.headers
		}, function(error, response, body){
			var isSuccess = false;
			if (response.statusCode == 200 && !error){
				isSuccess = true;
				try{
					data = JSON.parse(body);
				}catch(e){
					data = body;
				}
				result = {
					statusCode : response.statusCode,
					content :data
				};
			} else {
				try{
					data = JSON.parse(body);
				}catch(e){
					data = body;
				}
				try{
					data.correlationid  = reqHeader.headers.correlationid;
				}catch(e){}
				
				result = {
					statusCode : response.statusCode,
					content : data
				};
			}
			if(isSuccess) {
				resolve(result);
			} else {
				reject(result);
			}
		});
	});
    return myCustPromise; */
  },
  generateToken: async (req, res, requestName, url, bodyParams) => {
    let myCustPromise = new Promise((resolve, reject) => {
		apiUrl = config.serverUrlWebUrlLink + url;
		var result;
		request({
			url : apiUrl, 
		    method : 'POST',
		    headers	: {
			'Content-Type': 'application/x-www-form-urlencoded'
			},
		    body: bodyParams
		}, function(error, response, body){
			var isSuccess = false;
			if (response.statusCode == 200 && !error){
				isSuccess = true;
				result = {
					statusCode : response.statusCode,
					content :body
				};
			} else {
				try{
					data = JSON.parse(body);
				}catch(e){
					data = body;
				}
				try{
					data.correlationid  = reqHeader.headers.correlationid;
				}catch(e){}
				
				result = {
					statusCode : response.statusCode,
					content : data
				};
			}
			if(isSuccess) {
				resolve(result);
			} else {
				reject(result);
			}
		});
	});
    return myCustPromise;
  }
}
