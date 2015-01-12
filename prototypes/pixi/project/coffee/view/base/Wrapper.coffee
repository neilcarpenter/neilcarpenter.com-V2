AbstractView    = require '../AbstractView'
HomePageView    = require '../pages/homePage/HomePageView'
AboutPageView   = require '../pages/aboutPage/AboutPageView'
WorkPageView    = require '../pages/workPage/WorkPageView'
ProjectPageView = require '../pages/projectPage/ProjectPageView'
ContactPageView = require '../pages/contactPage/ContactPageView'
Nav             = require '../../router/Nav'
Scroller        = require '../../utils/Scroller'

class Wrapper extends AbstractView

	@VIEW_UPDATED : 'VIEW_UPDATED'

	template          : 'wrapper'

	views             : null
	previousView      : null
	currentView       : null

	pageSwitchDfd     : null
	activeViewRequest : null
	scrollToTopDfd    : null

	FIRST_VIEW        : true

	constructor : ->

		@views =
			home    : classRef : HomePageView,    area : @NC().nav.sections.HOME,    sub : false
			about   : classRef : AboutPageView,   area : @NC().nav.sections.ABOUT,   sub : false
			work    : classRef : WorkPageView,    area : @NC().nav.sections.WORK,    sub : false
			project : classRef : ProjectPageView, area : @NC().nav.sections.WORK,    sub : true
			contact : classRef : ContactPageView, area : @NC().nav.sections.CONTACT, sub : false

		super()

		return null

	getViewByURL : (area, sub) =>

		for name, data of @views
			return @views[name] if (area is @views[name].area) and ((@views[name].sub and sub) or (!@views[name].sub and !sub))

		null

	init : =>

		@NC().appView.on 'start', @start

		null

	start : =>

		@NC().appView.off 'start', @start

		@updateDims()
		@bindEvents()

		null

	bindEvents : =>

		@NC().nav.on Nav.EVENT_CHANGE_VIEW, @changeView
		@NC().appView.on @NC().appView.EVENT_UPDATE_DIMENSIONS, @updateDims
		@on Wrapper.VIEW_UPDATED, @onViewUpdated

		null

	updateDims : =>

		@$el.css 'min-height', @NC().appView.dims.h

		null

	changeView : (area, sub, query) =>

		if @pageSwitchDfd and @pageSwitchDfd.state() isnt 'resolved'
			do (area, sub) => @pageSwitchDfd.done => @changeView area, sub
			return

		newView = @getViewByURL area, sub

		@NC().appView.preloader.show()

		@previousView = @currentView
		@currentView  = new newView.classRef area, sub, query

		if @FIRST_VIEW
			@transitionViews()
			@FIRST_VIEW = false
		else
			@getNewViewContent()


		null

	getNewViewContent : =>

		@pageSwitchDfd = $.Deferred()

		@activeViewRequest = @currentView.getViewContent()
		@scrollToTopDfd    = @scrollToTop()

		dfds = [@activeViewRequest, @scrollToTopDfd]

		$.when.apply($, dfds).done =>

			@NC().appView.preloader.hide =>

				@transitionViews @previousView, @currentView, =>

					@trigger Wrapper.VIEW_UPDATED

		null

	transitionViews : (from=@previousView, to=@currentView, cb) =>

		# console.log "transitionViews : (from=@previousView, to=@currentView) =>", from, to

		# console.log "!!! TRANSITIONING VIEWS !!!"

		force = (from and (from instanceof ProjectPageView and to instanceof ProjectPageView))

		if !from
			to.show => cb?()
		else
			from.hide => to.show force, =>
				@pageSwitchDfd.resolve()
				cb?()

		@NC().appView.getDims()

		null

	onViewUpdated : =>

		@updatePageTitle @currentView.pageTitle

		null

	updatePageTitle : (title) =>

		# console.log "updatePageTitle : (title) =>", title

		if title and (window.document.title isnt title) then window.document.title = title

		null

	scrollToTop : =>

		dfd = $.Deferred()

		Scroller.scrollTo target : 0, => dfd.resolve()

		dfd

module.exports = Wrapper
