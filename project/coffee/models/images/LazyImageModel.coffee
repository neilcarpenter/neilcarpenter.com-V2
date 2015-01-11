AbstractModel = require '../AbstractModel'

class LazyImageModel extends Backbone.Model

	@states : 
		LOADED   : 'LOADED'
		PROGRESS : 'PROGRESS'

	classNames :
		LOADED   : 'loaded'
		BG_IMAGE : 'bg-image'

	defaults :
		src      : ""
		$els     : []
		state    : ""
		progress : 0
		canShow  : false

	constructor : ->

		super

		@start()

		return null

	start : =>

		if 'FormData' of window then @_loadImageXHR() else @_loadImageNoXHR()

		null

	addEl : ($el) =>

		$els = @get('$els')
		$els.push $el
		@set '$els', $els

		null

	_loadImageNoXHR : =>

		i = new Image
		i.onload = i.onabort = i.onerror = @onLoadComplete
		i.src = @get('src')

		null

	_loadImageXHR : =>

		# console.log "LOADING ", @get('src')

		# @preloader = new Preloader('header')
		# @preloader.show()

		r = $.ajax
			type : 'GET'
			url  : @get('src')
			xhr  : =>
				xhr = new window.XMLHttpRequest()
				xhr.addEventListener "progress", (evt) =>
					@onLoadProgress evt
				, false
				return xhr

		r.done @onLoadComplete
		r.fail @onLoadFail

		null

	onLoadProgress : (evt) =>

		@set 'state', LazyImageModel.states.PROGRESS

		if (evt.lengthComputable)

			percentComplete = (evt.loaded / evt.total) * 100
			# @preloader.goTo percentComplete

		# console.log "percentComplete - #{percentComplete}% for #{@get('src')}"

		null

	onLoadComplete : (res) =>

		# @preloader?.hide()

		@set 'state', LazyImageModel.states.LOADED

		# console.log "onLoadComplete : (res) =>", @get('src')

		if @get('canShow') then @animIn()

		null

	onLoadFail : (res) =>

		console.error "onLoadFail : =>", res

		# @$headerImage.addClass('image-loaded')
		# @preloader?.hide()

		null

	show : =>

		@set 'canShow', true

		if @get('state') is LazyImageModel.states.LOADED then @animIn()

		null

	animIn : =>

		for $el in @get('$els')
			$el
				.find(".#{@classNames.BG_IMAGE}")
					.css('background-image', "url(#{@get('src')})")
					.end()
				.addClass @classNames.LOADED

		null

module.exports = LazyImageModel
