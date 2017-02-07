class Router extends Backbone.Router

    @EVENT_HASH_CHANGED         : 'EVENT_HASH_CHANGED'
    @EVENT_HASHFRAGMENT_CHANGED : 'EVENT_HASHFRAGMENT_CHANGED'

    FIRST_ROUTE : true

    routes :
        '(/)(:area)(/:sub)(/)' : 'hashChanged'
        '*actions'             : 'navigateTo'

    area   : null
    sub    : null
    query  : null
    params : null

    start : =>

        @disableScrollRestoration()

        Backbone.history.start 
            pushState : true
            root      : @NC().BASE_PATH

        @bindEvents()

        null

    disableScrollRestoration : =>

        if 'scrollRestoration' in window.history
            window.history.scrollRestoration = 'manual'

        null

    bindEvents : =>

        @on @EVENT_HASHFRAGMENT_CHANGED, @onHashFragmentChange

        null

    hashChanged : (@area = null, @sub = null, @query = null) =>

        # console.log ">> EVENT_HASH_CHANGED @area = #{@area}, @sub = #{@sub}, @query = #{JSON.stringify(@query)} <<"

        if !@area then @area = @NC().nav.sections.HOME

        @trigger Router.EVENT_HASH_CHANGED, @area, @sub, @query, @params

        if @FIRST_ROUTE
            @FIRST_ROUTE = false
        else
            @NC().appView.trackPageView()

        null

    navigateTo : (where = '', trigger = true, replace = false, @params) =>

        if where.charAt(0) isnt "/"
            where = "/#{where}"
        if where.charAt( where.length-1 ) isnt "/" and where.indexOf('?') < 0
            where = "#{where}/"

        if !trigger
            @trigger Router.EVENT_HASH_CHANGED, where, null, @query, @params
            return

        @navigate where, trigger: true, replace: replace

        null

    onHashFragmentChange : =>

        @NC().appView.trackPageView()

        null

    NC : =>

        return window.NC

module.exports = Router
