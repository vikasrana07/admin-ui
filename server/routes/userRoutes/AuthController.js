const httpService = require('../../services/httpService');
const reqResponse = require('../../cors/responseHandler');
const { validationResult } = require('express-validator');

module.exports = {
	generateToken: async (req, res) => {
		/* const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(402).send(reqResponse.errorResponse(402));
		} */
		try {
			let bodyParams = "grant_type=password&username=" + req.body.username + "&password=" + req.body.password;
			let result = await httpService.generateToken(req, res, 'generateToken', bodyParams);
			res.status(201).send(reqResponse.successResponse(201, "User Created", "User has been created successfully"));
		} catch (error) {
			console.error(error);
			res.status(502).send(reqResponse.errorResponse(502))
		}
	}
}


