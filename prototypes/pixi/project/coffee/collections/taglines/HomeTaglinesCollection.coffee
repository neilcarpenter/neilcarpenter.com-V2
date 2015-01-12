AbstractCollection = require '../AbstractCollection'
HomeTaglineModel   = require '../../models/taglines/HomeTaglineModel'

class HomeTaglinesCollection extends AbstractCollection

	model : HomeTaglineModel

	current : 0

	getNext : =>

		if @current is @length-1
			@current = 0
			return @getNext()

		@current++

		return @at @current

module.exports = HomeTaglinesCollection
