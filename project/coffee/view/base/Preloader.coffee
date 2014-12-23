AbstractView = require '../AbstractView'

class Preloader extends AbstractView
	
	cb              : null
	
	TRANSITION_TIME : 0.5

	templateName : 'preloader'

	constructor : (@type, @className) ->

		if @type is 'site'
			@setElement $('#preloader')
		else
			@setElFromTemplate()

		super()

		return null

	setElFromTemplate : =>

		tmpl = _.template @NC().templates.get(@templateName)
		@setElement $ tmpl type : @type
		@initialize true

		null

	init : =>

		@$progress = @$el.find('[data-progress]')

		null

	reset : =>

		null

	show : (@cb) =>

		@$el.addClass 'preloader-active'

		# @$el.css 'display' : 'block'

		null

	onShowComplete : =>

		@cb?()

		null

	hide : (@cb) =>

		# console.log "!!! HIDING PRELOADER !!!"

		@$el.removeClass 'preloader-active'
		setTimeout @onHideComplete, 300

		null

	onHideComplete : =>

		#@$el.css 'display' : 'none'
		@cb?()
		@reset()

		null

	goTo : (value) =>

		value = if value > 100 then 1 else value/100

		null

module.exports = Preloader