AbstractView = require '../view/AbstractView'
Router       = require './Router'

class Nav extends AbstractView

    @EVENT_CHANGE_VIEW     : 'EVENT_CHANGE_VIEW'
    @EVENT_CHANGE_SUB_VIEW : 'EVENT_CHANGE_SUB_VIEW'

    sections :
        HOME    : ''
        ABOUT   : 'about'
        WORK    : 'work'
        CONTACT : 'contact'
        # later
        # BLOG : 'blog'
        # LABS : 'labs'

    current  : area : null, sub : null, query : null
    previous : area : null, sub : null, query : null

    constructor: ->

        @NC().router.on Router.EVENT_HASH_CHANGED, @changeView

        return false

    getSection : (section) =>

        if section is '' then return true

        for sectionName, uri of @sections
            if uri is section then return sectionName

        false

    changeView: (area, sub, query, params) =>

        # console.log "area",area
        # console.log "sub",sub
        # console.log "params",params

        @previous = @current
        @current  = area : area, sub : sub, query : query

        @trigger Nav.EVENT_CHANGE_VIEW, area, sub, query

        if @NC().appView.modalManager.isOpen() then @NC().appView.modalManager.hideOpenModal()

        null

module.exports = Nav
