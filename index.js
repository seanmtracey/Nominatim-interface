'use strict';
const fetch = require('node-fetch');
const debug = require('debug')('api:lib:nominatim-interface');
const LRU = require("lru-cache");

const nominatimAPI = 'http://nominatim.openstreetmap.org';
const cache = LRU({
	max: 500,
	length: function (n, key) { return n * 2 + key.length },
	maxAge: (1000 * 60 * 60) * 24
});

module.exports = (location) => {
	
	if(location === undefined || location === "" || location === null){
		debug("searchForLocation: Request was rejected", location);
		return Promise.reject("A location was not passed to the function");
	}
	
	const nominatimQuery = `${nominatimAPI}/search?q=${location}&format=json`;

	const cachedVersion = cache.get(`nominatim-search:${location}`);
	debug(`Is there cached Nominatim information about the location ${location}?`, cachedVersion !== undefined);

	if(cachedVersion){
		const parsedCacheVersion = JSON.parse(cachedVersion);
		debug(`Returning cached location information for ${location}`);
		return Promise.resolve(parsedCacheVersion.data);
	}

	console.log(nominatimQuery);

	return fetch(nominatimQuery)
		.then(res => res.json())
		.then(data => {
			
			debug(data);

			cache.set(`nominatim-search:${location}`, JSON.stringify({
				state : 'resolved',
				data
			}));

			return data;

		})
	;
	
}