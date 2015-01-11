AbstractViewPage = require '../../AbstractViewPage'
WordTransitioner = require '../../../utils/WordTransitioner'

class WorkPageView extends AbstractViewPage

	template : 'page-work'

	pageSize : 10000

	constructor : ->

		super

		return null

	show : =>

		super

		# WordTransitioner.in @$el

		null

module.exports = WorkPageView
