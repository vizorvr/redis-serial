var when = require('when')

/**
 * generate a serial number using Redis
 **/

function SerialNumber(redisClient) {
	this.redisClient = redisClient
}

SerialNumber.prototype.init = function() {}

SerialNumber.prototype.next = function(key) {
	var dfd = when.defer()

	this.redisClient.incr('serial:'+key, function(err, value) {
		if (err)
			return dfd.reject(err)

		dfd.resolve(value)
	})

	return dfd.promise
}

SerialNumber.prototype.get = function(key) {
	var dfd = when.defer()

	this.redisClient.get('serial:'+key, function(err, value) {
		if (err)
			return dfd.reject(err)

		dfd.resolve(value)
	})

	return dfd.promise
}

SerialNumber.prototype.set = function(key, value) {
	var dfd = when.defer()

	this.redisClient.set('serial:'+key, value, function(err, value) {
		if (err)
			return dfd.reject(err)

		dfd.resolve(value)
	})

	return dfd.promise
}

SerialNumber.prototype.__reset = function(key) {
	var dfd = when.defer()
	var that = this

	this.redisClient.set('serial:'+key, 0, function(err) {
		if (err)
			return dfd.reject(err)

		dfd.resolve(that.get('serial:'+key))
	})


	return dfd.promise
}

module.exports = SerialNumber
