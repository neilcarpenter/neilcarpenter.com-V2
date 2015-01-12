Templates    = require './data/Templates'
Router       = require './router/Router'
Nav          = require './router/Nav'
AppData      = require './AppData'
AppView      = require './AppView'
MediaQueries = require './utils/MediaQueries'

class App

    LIVE            : null
    BASE_PATH       : window.config.base_path
    BASE_URL        : window.config.base_url
    BASE_URL_ASSETS : window.config.base_url_assets
    objReady        : 0

    _toClean   : ['objReady', 'setFlags', 'objectComplete', 'init', 'initObjects', 'initSDKs', 'initApp', 'go', 'cleanup', '_toClean']

    constructor : (@LIVE) ->

        return null

    setFlags : =>

        ua = window.navigator.userAgent.toLowerCase()

        MediaQueries.setup();

        # @IS_ANDROID    = ua.indexOf('android') > -1
        # @IS_FIREFOX    = ua.indexOf('firefox') > -1
        # @IS_CHROME_IOS = if ua.match('crios') then true else false # http://stackoverflow.com/a/13808053

        null

    objectComplete : =>

        @objReady++
        @initApp() if @objReady >= 1

        null

    init : =>

        # currently no objects to load here, so just start app
        # @initObjects()

        @initApp()

        null

    # initObjects : =>

    #     @templates = new Templates "#{@BASE_URL_ASSETS}/data/templates#{(if @LIVE then '.min' else '')}.xml", @objectComplete

    #     # if new objects are added don't forget to change the `@objectComplete` function

    #     null

    initApp : =>

        @setFlags()

        ### Starts application ###
        @appData = new AppData
        @appView = new AppView
        @router  = new Router
        @nav     = new Nav

        @go()

        null

    go : =>

        ### After everything is loaded, kicks off website ###
        @appView.render()

        ### remove redundant initialisation methods / properties ###
        @cleanup()

        null

    cleanup : =>

        for fn in @_toClean
            @[fn] = null
            delete @[fn]

        null

module.exports = App
