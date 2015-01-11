AbstractView        = require '../view/AbstractView'
Wrapper             = require '../view/base/Wrapper'
LazyImageCollection = require '../collections/images/LazyImageCollection'

class LazyImageLoader extends AbstractView

	@ATTR : 'data-lazyimage'

	constructor : ->

		@images = new LazyImageCollection

		super

		@NC().appView.on 'start', @onStart

		return null

	onStart : =>

		@NC().appView.off 'start', @onStart

		@bindEvents()

		null

	bindEvents : =>

		@NC().appView.wrapper.on Wrapper.VIEW_UPDATED, @onViewUpdated

		null

	onViewUpdated : =>

		@NC().appView.wrapper.currentView.$el.find("[#{LazyImageLoader.ATTR}]").each (i, el) => @load $(el)

		null

	load : ($el) =>

		img = @_getImageFromEl $el

		return unless img.src and !img.$el.data('loading')
		img.$el.data('loading', true)

		@images.addImage img

		null

	show : ($el) =>

		img = @_getImageFromEl $el

		imgRef = @images.findWhere src : img.src

		imgRef?.show()

		null

	_getImageFromEl : ($el) =>

		img = {}

		img.$el = if $el.attr("#{LazyImageLoader.ATTR}") then $el else $el.find("[#{LazyImageLoader.ATTR}]")
		_imgSrc = img.$el.attr("#{LazyImageLoader.ATTR}")
		img.src = if _imgSrc then @supplantString _imgSrc, @_getVars() else null

		img

	_getVars : =>

		vars =
			BASE_URL : @NC().BASE_URL
			RWD_SIZE : @NC().appView.dims.r

		vars

module.exports = LazyImageLoader
