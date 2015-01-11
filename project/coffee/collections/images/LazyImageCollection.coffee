AbstractCollection = require '../AbstractCollection'
LazyImageModel     = require '../../models/images/LazyImageModel'

class LazyImageCollection extends AbstractCollection

	model : LazyImageModel

	addImage : (imgToAdd) =>

		existingRef = @findWhere src : imgToAdd.src

		if existingRef
			existingRef.addEl imgToAdd.$el
		else
			@add src : imgToAdd.src, $els : [imgToAdd.$el]

		null

module.exports = LazyImageCollection
