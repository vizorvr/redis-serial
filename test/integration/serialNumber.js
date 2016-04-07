var assert = require('assert')
var SerialNumber = require('../../index')
var redis = require('redis')

describe('SerialNumber', function() {
	var sn, rc

	before(function(done) {
		rc = redis.createClient()
		rc.on('connect', done)
	})

	beforeEach(function(done) {
		sn = new SerialNumber(rc)
		sn.init()
		sn.__reset('test')
			.then(function(v) {
				done()
			})
	})

	after(function() {
		rc.end()
	})

	it('can get current value', function(done) {
		return sn.get('test')
		.then(function(value) {
			assert.equal(0, value)
			done()
		})
	})

	it('can get next sequence twice', function(done) {
		return sn.next('test')
		.then(function(value) {
			assert.equal(1, value)

			return sn.next('test')
			.then(function(value) {
				assert.equal(2, value)
				done()
			})
		})
	})

	it('can get next sequence and then current value', function(done) {
		return sn.next('test')
		.then(function(value) {
			assert.equal(1, value)

			return sn.get('test')
			.then(function(value) {
				assert.equal(1, value)
				done()
			})
		})
	})
})