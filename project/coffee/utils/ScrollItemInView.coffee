AbstractView     = require '../view/AbstractView'
Wrapper          = require '../view/base/Wrapper'
WordTransitioner = require './WordTransitioner'

class ScrollItemInView extends AbstractView

	CSS_CLASS_SHOW : 'show'

	defaults :
		showThreshold : 0.85
		itemDelay     : 250

	items : []

	lastScrollY : 0
	ticking     : false

	constructor : ->

		super

		@NC().appView.on 'start', @onStart

		return null

	onStart : =>

		@NC().appView.off 'start', @onStart

		@bindEvents()

		null

	bindEvents : =>

		@NC().appView.wrapper.on Wrapper.VIEW_UPDATED, @getItems

		null

	onScroll : =>

		@lastScrollY = window.scrollY
		@requestTick()

		null

	requestTick : =>

		if !@ticking
			requestAnimationFrame @scrollUpdate
			@ticking = true

		null

	scrollUpdate : =>

		@ticking = false

		return unless @items.length

		threshold   = @lastScrollY + (@NC().appView.dims.h * @defaults.showThreshold)
		itemsToShow = []

		for item, i in @items

			if threshold > item.offset
				itemsToShow.push item

		if itemsToShow.length
			@showItems itemsToShow
			@items = @items.slice itemsToShow.length, @items.length

		null

	getItems : =>

		@NC().appView.wrapper.currentView.$el
			.find('[data-scroll-item]').each (i, el) =>

				$el = $(el)

				@items.push
					$el    : $el
					offset : $el.offset().top

		null

	showItems : (items) =>

		for item, i in items
			do (item, i) =>

				delay = (@defaults.itemDelay*i)

				setTimeout =>
					item.$el.addClass @CSS_CLASS_SHOW
					WordTransitioner.in item.$el
				, delay

		null

module.exports = ScrollItemInView
