AppView          = require '../../../AppView'
AbstractViewPage = require '../../AbstractViewPage'
WordTransitioner = require '../../../utils/WordTransitioner'
Scroller         = require '../../../utils/Scroller'

class ProjectPageView extends AbstractViewPage

	template : 'page-project'

	sizes : 
		PADDING_DESKTOP      : 20
		HIDE_HEADING_DESKTOP : 50

	classNames : {}

	constructor : ->

		super

		return null

	init : =>

		@$hero      = @$el.find('.proj-hero')
		@$heading   = @$el.find('.proj-heading')
		@$toFadeOut = @$heading.add @$el.find('.scroll-to-content')

		null

	setListeners : (setting) =>

		@NC().appView[setting] AppView.EVENT_UPDATE_DIMENSIONS, @onResize
		@NC().appView[setting] AppView.EVENT_ON_SCROLL, @onScroll

		@$el.find('[data-scroll-to-content]')[setting] 'click', @scrollToContent

		if setting is 'on'
			@onResize()
			@showTitle()

		null

	onResize : =>

		@sizes.HIDE_HEADING_DESKTOP = @NC().appView.dims.h - @NC().appView.header.sizes.DESKTOP

		@$hero.css 'height', @NC().appView.dims.h - @NC().appView.header.sizes.DESKTOP - @sizes.PADDING_DESKTOP

		null

	onScroll : =>

		if @NC().appView.lastScrollY > 0 and @NC().appView.lastScrollY < @sizes.HIDE_HEADING_DESKTOP

			maxHeadingTranslate = 150
			maxHeroScale        = (@NC().appView.dims.w/(@NC().appView.dims.w-(@sizes.PADDING_DESKTOP*2)))-1

			state = (@NC().appView.lastScrollY / @sizes.HIDE_HEADING_DESKTOP)

			headingTranslate = state * maxHeadingTranslate
			headingOpacity   = 1 - state
			heroScale        = 1 + (state * maxHeroScale)

			@$toFadeOut.css 'transform': @CSSTranslate(0, headingTranslate, 'px'), 'opacity': headingOpacity
			@$hero.css 'transform': "scale(#{heroScale})"

		else if @NC().appView.lastScrollY <= 0

			@$toFadeOut.css 'transform': 'none', 'opacity': 1
			@$hero.css 'transform': "none"

		null

	scrollToContent : =>

		Scroller.scrollTo target : @NC().appView.dims.h - @NC().appView.header.sizes.DESKTOP - @sizes.PADDING_DESKTOP

		null

	showTitle : =>

		WordTransitioner.in @$heading

		null

module.exports = ProjectPageView
