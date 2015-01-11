AbstractView = require '../AbstractView'

class Preloader extends AbstractView
	
	cb : null
	
	TRANSITION_DURATION : 600
	FIRST_HIDE_DELAY    : 500

	classNames :
		SHOW   : 'show'
		SHOWN  : 'shown'
		HIDING : 'hiding'

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

		@$maskOuter = @$el.find('[data-preloader-mask="outer"]')
		@$maskInner = @$el.find('[data-preloader-mask="inner"]')

		null

	reset : =>

		@$maskOuter.css "width", "100%"
		@$maskInner.css "width", "0%"

		null

	show : (@cb) =>

		@$el.addClass @classNames.SHOW

		# @$el.css 'display' : 'block'

		null

	onShowComplete : =>

		@cb?()

		null

	hide : (@cb) =>

		# console.log "!!! HIDING PRELOADER !!!"

		@goTo 100

		@$el.addClass(@classNames.HIDING).removeClass(@classNames.SHOW)
		setTimeout @onHideComplete, @TRANSITION_DURATION

		null

	firstHide : (cb) =>

		setTimeout =>
			@hide cb
		, @FIRST_HIDE_DELAY

		null

	onHideComplete : =>

		#@$el.css 'display' : 'none'
		@cb?()
		@reset()

		@$el.addClass(@classNames.SHOWN).removeClass(@classNames.HIDING)

		null

	goTo : (value) =>

		# console.log "goTo : (value) =>", value

		value = if value > 100 then 100 else value

		@$maskOuter.css "width", "#{(100-value)}%"
		@$maskInner.css "width", "#{(value)}%"

		null

module.exports = Preloader
