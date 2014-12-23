AbstractView = require '../AbstractView'
Router       = require '../../router/Router'

class Header extends AbstractView

	template : 'site-header'

	constructor : ->

		super()

		@$navLinks = @$el.find('nav a')

		@bindEvents()

		return null

	bindEvents : =>

		@NC().router.on Router.EVENT_HASH_CHANGED, @onHashChange

		null

	onHashChange : =>

		area = @NC().router.area
		url  = @_getLinkURL area

		@$navLinks
			.not("[href=\"#{url}\"]")
				.removeClass('active')
				.end()
			.filter("[href=\"#{url}\"]")
				.addClass('active')

		null

	_getLinkURL : (area) =>

		return @NC().BASE_URL + '/' + area

module.exports = Header
