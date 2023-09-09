const mongoose = require("mongoose");

module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		const DBURI = "mongodb+srv://rmihoub:YOUR-PASSWORD-HERE@cluster0.vvln5ml.mongodb.net/?retryWrites=true&w=majority";
		mongoose.connect(DBURI, connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};