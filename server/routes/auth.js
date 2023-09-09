const router = require("express").Router();
const { User } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passport = require("passport");
const request = require('request');

const JWTPRIVATEKEY = `Replace your private code here`

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		if (!user.verified) {
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
				const url = `http://localhost:3000/users/${user.id}/verify/${token.token}`;
				await sendEmail(user.email, "Verify Email", url);
			}

			return res
				.status(400)
				.send({ message: "An Email sent to your account please verify" });
		}

		const token = user.generateAuthToken();
		
		res.status(200).send({ data: token, message: "logged in successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

  

  router.get('/google', (req, res) => {
	const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http://localhost:8080/auth/google/callback&scope=profile%20email&client_id=Replace your google client ID here';
	
	// Forward the request to Google OAuth
	request(googleAuthUrl, (error, response, body) => {
	  if (!error && response.statusCode === 200) {
		// Send the Google OAuth response back to the client
		console.log(body)
		res.send(body);
	  } else {
		res.status(500).send('Error');
	  }
	});
  });

  router.get(
	"/google/callback",
	(req, res, next) => {
	  passport.authenticate("google", (err, user, info) => {
		if (err) {
		  return next(err);
		}
		if (!user) {
		  return res.redirect("http://localhost:3000/");
		}
  
	
		const token = jwt.sign({ userId: user._id }, JWTPRIVATEKEY);
	    res.status(200).json({ token }); // Send the token as a JSON response
		return res.redirect("http://localhost:3000/");
	  })(req, res, next);
	}
  );
  
const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;