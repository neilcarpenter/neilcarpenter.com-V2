AppView          = require '../../../AppView'
AbstractViewPage = require '../../AbstractViewPage'
WordTransitioner = require '../../../utils/WordTransitioner'
Scroller         = require '../../../utils/Scroller'
MediaQueries     = require '../../../utils/MediaQueries'

class ProjectPageView extends AbstractViewPage

	template : 'page-project'

	device : 'DESKTOP' # default

	sizes : 
		PADDING_DESKTOP : 20
		PADDING_MOBILE  : 12
		HIDE_HEADING    : 50

	classNames : {}

	constructor : ->

		@filterPrefix = if document.body.style.webkitFilter isnt undefined then '-webkit-' else ''

		super

		return null

	init : =>

		@$hero      = @$el.find('.proj-hero')
		@$heading   = @$el.find('.proj-heading')
		@$toFadeOut = @$heading.add @$el.find('.scroll-to-content')

		null

	setListeners : (setting) =>

		@NC().appView[setting] @NC().appView.EVENT_UPDATE_DIMENSIONS, @onResize
		@NC().appView[setting] @NC().appView.EVENT_ON_SCROLL, @onScroll

		@$el.find('[data-scroll-to-content]')[setting] 'click', @scrollToContent

		if setting is 'on'
			@onResize force : true
			@showTitle()

		null

	onResize : (args={}) =>

		return unless @NC().appView.dims.updateMobile or args.force

		@device = if MediaQueries.getBreakpoint() is 'Small' then 'MOBILE' else'DESKTOP'

		@sizes.HIDE_HEADING = @NC().appView.dims.h - @NC().appView.header.sizes[@device]

		@$hero.css 'height', @NC().appView.dims.h - @NC().appView.header.sizes[@device] - @sizes["PADDING_#{@device}"]

		null

	onScroll : =>

		if @NC().appView.lastScrollY > 0 and @NC().appView.lastScrollY < @sizes.HIDE_HEADING

			maxHeadingTranslate = 150
			maxHeroScale        = (@NC().appView.dims.w/(@NC().appView.dims.w-(@sizes["PADDING_#{@device}"]*2)))-1

			state = (@NC().appView.lastScrollY / @sizes.HIDE_HEADING)

			headingTranslate = state * maxHeadingTranslate
			headingOpacity   = 1 - state
			heroScale        = 1 + (state * maxHeroScale)

			grayscale  = state
			brightness = 1 - (state*0.5)

			heroCSS = 'transform': "scale(#{heroScale})"
			heroCSS["#{@filterPrefix}filter"] = "grayscale(#{grayscale}) brightness(#{brightness})"

			@$toFadeOut.css 'transform': @CSSTranslate(0, headingTranslate, 'px'), 'opacity': headingOpacity
			@$hero.css heroCSS

		else if @NC().appView.lastScrollY <= 0

			heroCSS = 'transform': 'none'
			heroCSS["#{@filterPrefix}filter"] = "none"

			@$toFadeOut.css 'transform': 'none', 'opacity': 1
			@$hero.css heroCSS

		null

	scrollToContent : =>

		target = @NC().appView.dims.h - @NC().appView.header.sizes[@device] - @sizes["PADDING_#{@device}"]

		Scroller.scrollTo target : target, =>

			items = []
			@$el.find('[data-post-intro]').find('[data-scroll-item]').each (i, el) => items.push $el : $(el)
			@NC().appView.scrollItemInView.showItems items if items.length


		null

	showTitle : =>

		WordTransitioner.in @$heading

		null

module.exports = ProjectPageView
