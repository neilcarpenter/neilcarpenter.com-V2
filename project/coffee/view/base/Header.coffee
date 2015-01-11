AbstractView = require '../AbstractView'
Router       = require '../../router/Router'
MediaQueries = require '../../utils/MediaQueries'

class Header extends AbstractView

	template : 'site-header'

	classNames :
		ANIM_IN      : 'anim-in'
		MENU_OPEN    : 'menu-open'
		MENU_CLOSING : 'menu-closing'
		NAV_ACTIVE   : 'active'

	sizes :
		DESKTOP : 76
		MOBILE  : 65

	MENU_TRANSITION_DURATION : 300

	menuOpen : false

	constructor : ->

		super()

		@$nav      = @$el.find('nav ')
		@$navLinks = @$nav.find('a')

		@setDims()
		@bindEvents()

		return null

	bindEvents : =>

		@NC().appView.on @NC().appView.EVENT_UPDATE_DIMENSIONS, @setDims
		@NC().router.on Router.EVENT_HASH_CHANGED, @onHashChange

		@$el.find('[data-mobile-menu]').on window.touchEndInteraction, @toggleMenu

		null

	toggleMenu : =>

		if @menuOpen then @closeMenu() else @openMenu()

		return false

	openMenu : =>

		@sizeMobileMenu()

		@$el.addClass(@classNames.MENU_OPEN)
		@NC().appView.disableTouch()

		@menuOpen = true

		null

	closeMenu : =>

		@$el.addClass(@classNames.MENU_CLOSING).removeClass(@classNames.MENU_OPEN)
		@NC().appView.enableTouch()
		setTimeout @onMenuClosed, @MENU_TRANSITION_DURATION

		@menuOpen = false

		null

	onMenuClosed : =>

		@$el.removeClass(@classNames.MENU_CLOSING)

		null

	sizeMobileMenu : =>

		@$nav.css "height" : @NC().appView.dims.h

		null

	unSizeMobileMenu : =>

		@$nav.css "height" : "auto"

		null

	setDims : =>

		if MediaQueries.getBreakpoint() is 'Smallest'
			@sizeMobileMenu()
		else
			@unSizeMobileMenu()
			@closeMenu()

		null

	animateIn : =>

		@$el.addClass @classNames.ANIM_IN

		null

	onHashChange : =>

		@closeMenu() if @menuOpen

		area = @NC().router.area
		url  = @_getLinkURL area

		@$navLinks
			.not("[href=\"#{url}\"]")
				.removeClass(@classNames.NAV_ACTIVE)
				.end()
			.filter("[href=\"#{url}\"]")
				.addClass(@classNames.NAV_ACTIVE)

		null

	_getLinkURL : (area) =>

		return @NC().BASE_URL + '/' + area

module.exports = Header
