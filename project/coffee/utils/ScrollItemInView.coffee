AppView          = require '../AppView'
AbstractView     = require '../view/AbstractView'
Wrapper          = require '../view/base/Wrapper'
WordTransitioner = require './WordTransitioner'
VideoAutoPlayer  = require './VideoAutoPlayer'
LazyImageLoader  = require './LazyImageLoader'

class ScrollItemInView extends AbstractView

	classNames :
		SHOW : 'show'

	defaults :
		showThreshold : 0.8
		itemDelay     : 250

	items : []
	videoItems : []

	constructor : ->

		super

		@NC().appView.on 'start', @onStart

		return null

	onStart : =>

		@NC().appView.off 'start', @onStart

		@bindEvents()

		null

	bindEvents : =>

		@NC().appView.on @NC().appView.EVENT_ON_SCROLL, @onScroll
		@NC().appView.on @NC().appView.EVENT_ON_SCROLL_END, @onScrollEnd
		@NC().appView.on @NC().appView.EVENT_UPDATE_DIMENSIONS, @onDimsUpdated
		@NC().appView.wrapper.on Wrapper.VIEW_UPDATED, @onViewUpdated

		null

	onViewUpdated : =>

		@items = []
		@videoItems = []

		@getItems()
		@onScroll()

		null

	onDimsUpdated : =>

		for item in @items
			item.offset = item.$el.offset().top

		for item in @videoItems
			item.offset = item.$el.offset().top
			item.height = item.$el.outerHeight()

		null

	onScroll : =>

		return unless @items.length or @videoItems.length

		threshold   = @NC().appView.lastScrollY + (@NC().appView.dims.h * @defaults.showThreshold)
		itemsToShow = []

		(if threshold > item.offset then itemsToShow.push item) for item, i in @items

		if itemsToShow.length
			@showItems itemsToShow
			@items = @items.slice itemsToShow.length, @items.length

		videoItemsToPlay = @videoItems
			.filter (item) => !item.playing
			.filter (item) => threshold > item.offset and ((threshold - @NC().appView.dims.h) < (item.offset + item.height))

		videoItemsToPause = @videoItems
			.filter (item) => item.playing
			.filter (item) => threshold < item.offset or (threshold - @NC().appView.dims.h) > (item.offset + item.height)

		if videoItemsToPlay.length then @playVideos videoItemsToPlay
		if videoItemsToPause.length then @pauseVideos videoItemsToPause

		null

	onScrollEnd : =>

		@updateItems()
		@onScroll()

		null

	getItems : =>

		@NC().appView.wrapper.currentView.$el
			.find('[data-scroll-item]').each (i, el) =>

				$el    = $(el)
				offset = $el.offset().top

				@items.push
					$el    : $el
					offset : offset

				@items = _.sortBy @items, (item) -> return item.offset

				if $el.attr('data-scroll-item') is 'video'

					@videoItems.push
						$el     : $el
						offset  : offset
						height  : $el.outerHeight()
						playing : false

					@videoItems = _.sortBy @videoItems, (item) -> return item.offset

		null

	updateItems : =>

		for item in @items
			item.offset = item.$el.offset().top

		for videoItem in @videoItems
			videoItem.offset = videoItem.$el.offset().top
			videoItem.height = videoItem.$el.outerHeight()

		null

	showItems : (items) =>

		for item, i in items
			do (item, i) =>

				delay = (@defaults.itemDelay*i)

				setTimeout =>
					@showItem item.$el
				, delay

		null

	showItem : ($el) =>

		$el.addClass @classNames.SHOW

		WordTransitioner.in $el
		@NC().appView.lazyImageLoader.show $el

		null

	playVideos : (items) =>

		for item in items
			VideoAutoPlayer.play item.$el
			item.playing = true

		null

	pauseVideos : (items) =>

		for item in items
			VideoAutoPlayer.pause item.$el
			item.playing = false

		null

module.exports = ScrollItemInView
