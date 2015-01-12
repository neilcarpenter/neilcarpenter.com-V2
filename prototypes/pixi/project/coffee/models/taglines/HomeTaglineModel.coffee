AbstractModel = require '../AbstractModel'

class HomeTaglineModel extends AbstractModel

	defaults :
		tagline     : ""
		taglineHTML : ""

	_filterAttrs : (attrs) =>

		if attrs and attrs.tagline
			attrs.taglineHTML = @_getTaglineHTML attrs.tagline

		attrs

	_getTaglineHTML : (text) =>

		parts = text.split '<br/>'

		taglineHTML = "<span class=\"wo\"><span class=\"wi\">#{parts[0]}</span></span></br><span class=\"wo\"><span class=\"wi\">#{parts[1]}</span></span>"

		taglineHTML

module.exports = HomeTaglineModel
