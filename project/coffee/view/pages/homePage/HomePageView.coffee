AbstractViewPage       = require '../../AbstractViewPage'
HomeTaglinesCollection = require '../../../collections/taglines/HomeTaglinesCollection'
WordTransitioner       = require '../../../utils/WordTransitioner'

class HomePageView extends AbstractViewPage

	template : 'page-home'

	startTaglineTime : null
	taglineTimer     : null

	CHANGE_TAGLINE_INTERVAL : 5000
	FIRST_SHOW_DELAY        : 1000

	pageSize : 5000

	constructor : ->

		@taglines = new HomeTaglinesCollection

		super

		return null

	setListeners : (setting) =>

		if setting is 'on'

			@$tagline = @$el.find('[data-tagline]')
			@startTaglineTime = setTimeout =>
				@showFirstTagline()
				@getTaglines()
				@startTaglineTimer()
			, (if @NC().appView.wrapper.FIRST_VIEW then @FIRST_SHOW_DELAY else 0)

		else

			clearTimeout @startTaglineTime
			@stopTaglineTimer()

		null

	showFirstTagline : =>

		WordTransitioner.in @$tagline

		null

	getTaglines : =>

		@taglines.add window._TAGLINES.shift()
		@taglines.add _.shuffle window._TAGLINES

		null

	startTaglineTimer : =>

		console.log "startTaglineTimer : =>"

		@taglineTimer = setInterval @changeTagline, @CHANGE_TAGLINE_INTERVAL

		null

	stopTaglineTimer : =>

		clearInterval @taglineTimer

		null

	changeTagline : =>

		console.log "changeTagline : =>"

		WordTransitioner.out @$tagline, =>

			@$tagline.html @taglines.getNext().get('taglineHTML')

			# little delay to allow DOM to update
			setTimeout =>
				WordTransitioner.in @$tagline
			, 300

		null

module.exports = HomePageView
