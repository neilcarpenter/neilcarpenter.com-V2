AbstractView          = require './view/AbstractView'
MediaQueries          = require './utils/MediaQueries'
InteractiveBackground = require './view/background/InteractiveBackground'

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

    rwdSizes :
        LARGE  : 'LRG'
        MEDIUM : 'MED'
        SMALL  : 'SML'

    lastScrollY : 0
    ticking     : false

    EVENT_UPDATE_DIMENSIONS : 'EVENT_UPDATE_DIMENSIONS'
    EVENT_ON_SCROLL         : 'EVENT_ON_SCROLL'

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

        @interactiveBg = new InteractiveBackground

        @addChild @interactiveBg

        @onAllRendered()

        return

    bindEvents : =>

        @on 'allRendered', @onAllRendered

        @onResize()

        @onResize = _.debounce @onResize, 300
        @$window.on 'resize orientationchange', @onResize
        @$window.on "scroll", @onScroll

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
        , 50

        @trigger AppView.EVENT_ON_SCROLL

        null

    onAllRendered : =>

        # console.log "onAllRendered : =>"
        @begin()

        null

    begin : =>

        @trigger 'start'

        @onScroll()
        @interactiveBg.show()

        return

    onResize : =>

        @getDims()

        return

    getDims : =>

        w = window.innerWidth or document.documentElement.clientWidth or document.body.clientWidth
        h = window.innerHeight or document.documentElement.clientHeight or document.body.clientHeight

        @dims =
            w : w
            h : h
            o : if h > w then 'portrait' else 'landscape'
            c : if w <= @MOBILE_WIDTH then @MOBILE else @NON_MOBILE
            r : @getRwdSize w, h, (window.devicePixelRatio or 1)

        @trigger @EVENT_UPDATE_DIMENSIONS, @dims

        return

    getRwdSize : (w, h, dpr) =>

        pw = w*dpr

        size = switch true
            when pw > 1440 then @rwdSizes.LARGE
            when pw < 650 then @rwdSizes.SMALL
            else @rwdSizes.MEDIUM

        size

module.exports = AppView
