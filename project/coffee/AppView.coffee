AbstractView     = require './view/AbstractView'
Preloader        = require './view/base/Preloader'
Header           = require './view/base/Header'
Wrapper          = require './view/base/Wrapper'
ModalManager     = require './view/modals/_ModalManager'
MediaQueries     = require './utils/MediaQueries'
Scroller         = require './utils/Scroller'
ScrollItemInView = require './utils/ScrollItemInView'
LazyImageLoader  = require './utils/LazyImageLoader'
InteractiveBg    = require './view/interactive/InteractiveBg'

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
        r : null
        updateMobile : true
        lastHeight   : null

    rwdSizes :
        LARGE  : 'LRG'
        MEDIUM : 'MED'
        SMALL  : 'SML'

    lastScrollY : 0
    ticking     : false

    EVENT_UPDATE_DIMENSIONS : 'EVENT_UPDATE_DIMENSIONS'
    EVENT_ON_SCROLL         : 'EVENT_ON_SCROLL'
    EVENT_ON_SCROLL_END     : 'EVENT_ON_SCROLL_END'

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

        @preloader        = new Preloader('site', @$body.find('#preloader'))
        @modalManager     = new ModalManager
        @scrollItemInView = new ScrollItemInView
        @lazyImageLoader  = new LazyImageLoader
        @interactiveBg    = new InteractiveBg if @NC().HAZ_INTERACTIVE

        @header  = new Header
        @wrapper = new Wrapper

        @
            .addChild @header
            .addChild @wrapper
            .addChild @interactiveBg if @NC().HAZ_INTERACTIVE

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

        @$body.addClass('disable-hover')

        clearTimeout @timerScroll

        @timerScroll = setTimeout =>
            @$body.removeClass('disable-hover')
            @trigger @EVENT_ON_SCROLL_END
        , 50

        @trigger @EVENT_ON_SCROLL

        null

    onAllRendered : =>

        # console.log "onAllRendered : =>"
        @begin()

        null

    begin : =>

        @trigger 'start'

        @NC().router.start()

        @updateMediaQueriesLog()

        @preloader.firstHide =>

            @header.animateIn()
            @lazyImageLoader.onViewUpdated()
            @scrollItemInView.getItems()
            @interactiveBg?.show()
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

        change = h / @dims.lastHeight

        @dims =
            w : w
            h : h
            o : if h > w then 'portrait' else 'landscape'
            c : if w <= @MOBILE_WIDTH then @MOBILE else @NON_MOBILE
            r : @getRwdSize w, h, (window.devicePixelRatio or 1)
            updateMobile : !@NC().isMobile() or change < 0.8 or change > 1.2
            lastHeight   : h

        @trigger @EVENT_UPDATE_DIMENSIONS, @dims

        return

    getRwdSize : (w, h, dpr) =>

        pw = w*dpr

        size = switch true
            when pw > 1440 then @rwdSizes.LARGE
            when pw < 650 then @rwdSizes.SMALL
            else @rwdSizes.MEDIUM

        size

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
