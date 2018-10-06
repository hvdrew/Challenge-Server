/**
 * This file is going to be crammed with pretty much
 * all of the logic for now. This project hasn't quite
 * reached the point where I need to break it out.
 *
 * Disregard the lack of consistency with the console logs,
 * as it will be refactored when I have time to work on
 * the formatting.
 * 
 * v0.1
 */

/* INITIAL IMPORTS */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// const HostNameEntry = require('./model').HostNameEntry;

// TODO: Move this into a separate util file
/* DATABASE */
mongoose.connect(
	'mongodb://localhost:27017', {
		useNewUrlParser: true
	}
);
const db = mongoose.connection;
const Schema = mongoose.Schema;

const hostNameSchema = new Schema({
	hostname: {
		type: String,
		required: true,
		unique: true
	}
});

hostNameSchema.plugin(uniqueValidator);

const HostNameEntry = mongoose.model('Url', hostNameSchema);

// Handling miscellaneous DB events:
db.on('error', (error) => {
	console.log(`${error.name}: ${error.message}`);
});
db.on('open', () => console.log('Connected to MongoDB Successfully!\n\nServer listening on port 3000.\n\n===================\n'));

/* APP MIDDLEWARE BECAUSE WHY DO IT AGAIN */
// Body parser
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json());

// TODO: Move this into a separate controller file
/* ROUTING */
// Initial post route (will be used for logging urls in DB)
app.post('/log', (req, res) => {
	console.log(`New Hostname submitted: ${JSON.stringify(req.body.hostname)}`);
	console.log('Attempting to save...\n\n');

	let submission = new HostNameEntry({
		hostname: req.body.hostname
	});

	// TODO: Move this into the DB util file too
	submission.save((error, docs) => {
		if (error) {
			return console.log(`${error.name}:\n\n${error.message}\n\n===================\n`);
		} else {
			// Fetch the total number of unique hostnames (for use later)
			HostNameEntry.count({}, (error, count) => {
				console.log(`Total Entries: ${count}\n\n===================\n`);
			});
		}

		// TODO: Move this into the else statement above
		console.log('Saved submission successfully.\n\n===================\n');
	});

	// TODO: Send a helpful response with better headers
	res.end('beep boop');
});

/* FIRE IT UP */
app.listen(3000, () => console.clear());