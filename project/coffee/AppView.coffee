AbstractView     = require './view/AbstractView'
Preloader        = require './view/base/Preloader'
Header           = require './view/base/Header'
Wrapper          = require './view/base/Wrapper'
ModalManager     = require './view/modals/_ModalManager'
MediaQueries     = require './utils/MediaQueries'
Scroller         = require './utils/Scroller'
ScrollItemInView = require './utils/ScrollItemInView'

class AppView extends AbstractView

    template : 'main'

    $window  : null
    $body    : null

    wrapper  : null

    dims :
        w : null
        h : null
        o : null
        c : null

    EVENT_UPDATE_DIMENSIONS : 'EVENT_UPDATE_DIMENSIONS'

    MOBILE_WIDTH : 700
    MOBILE       : 'mobile'
    NON_MOBILE   : 'non_mobile'

    constructor : ->

        @$window = $(window)
        @$body   = $('body').eq(0)

        # these, rather than calling super
        @setElement @$body.find("[data-template=\"#{@template}\"]")
        @children = []

        return null

    disableTouch: =>

        @$window.on 'touchmove', @onTouchMove

        return

    enableTouch: =>

        @$window.off 'touchmove', @onTouchMove

        return

    onTouchMove: ( e ) ->

        e.preventDefault()

        return

    render : =>

        @bindEvents()

        @preloader        = new Preloader('site')
        @modalManager     = new ModalManager
        @scrollItemInView = new ScrollItemInView

        @header  = new Header
        @wrapper = new Wrapper

        @
            .addChild @header
            .addChild @wrapper

        @onAllRendered()

        return

    bindEvents : =>

        @on 'allRendered', @onAllRendered

        @onResize()

        @onResize = _.debounce @onResize, 300
        @$window.on 'resize orientationchange', @onResize
        @$window.on "scroll", @onScroll

        @$body.on 'click', 'a', @linkManager

        return

    onScroll : =>

        @$body.addClass('disable-hover')

        clearTimeout @timerScroll

        @timerScroll = setTimeout =>
            @$body.removeClass('disable-hover')
        , 50

        @scrollItemInView.onScroll()

        null

    onAllRendered : =>

        # console.log "onAllRendered : =>"
        @begin()

        null

    begin : =>

        @trigger 'start'

        @NC().router.start()

        @updateMediaQueriesLog()

        @preloader.hide =>

            @header.animateIn()
            @scrollItemInView.getItems()
            @onScroll()

        return

    onResize : =>

        @getDims()
        @updateMediaQueriesLog()

        return

    updateMediaQueriesLog : =>

        if @header then @header.$el.find(".breakpoint").html "<div class='l'>CURRENT BREAKPOINT:</div><div class='b'>#{MediaQueries.getBreakpoint()}</div>"
        return

    getDims : =>

        w = window.innerWidth or document.documentElement.clientWidth or document.body.clientWidth
        h = window.innerHeight or document.documentElement.clientHeight or document.body.clientHeight

        @dims =
            w : w
            h : h
            o : if h > w then 'portrait' else 'landscape'
            c : if w <= @MOBILE_WIDTH then @MOBILE else @NON_MOBILE

        @trigger @EVENT_UPDATE_DIMENSIONS, @dims

        return

    linkManager : (e) =>

        href = $(e.currentTarget).attr('href')

        if href then @navigateToUrl href, e

        null

    navigateToUrl : ( href, e = null ) =>

        route   = if href.match(@NC().BASE_URL) then href.split(@NC().BASE_URL)[1] else href
        section = if route.indexOf('/') is 0 then route.split('/')[1] else route

        console.log "route, section"
        console.log route, section

        if @NC().nav.getSection section
            e?.preventDefault()
            @NC().router.navigateTo route
        else 
            @handleExternalLink href

        return

    handleExternalLink : (data) => 

        ###

        bind tracking events if necessary

        ###

        return

    trackPageView : =>

        return unless window.ga

        ga 'send', 'pageview', 'page' : window.location.href.split(@NC().BASE_URL)[1] or '/'

        null

module.exports = AppView
