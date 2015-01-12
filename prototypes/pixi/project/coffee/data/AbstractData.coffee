class AbstractData

	constructor : ->

		_.extend @, Backbone.Events

		return null

	NC : =>

		return window.NC

module.exports = AbstractData
