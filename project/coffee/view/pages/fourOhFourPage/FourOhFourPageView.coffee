AbstractViewPage = require '../../AbstractViewPage'

class FourOhFourPageView extends AbstractViewPage

	template : 'page-404'

	pageSize : 6000

	constructor : ->

		###

		instantiate classes here

		@exampleClass = new ExampleClass

		###

		super

		###

		add classes to app structure here

		@
			.addChild(@exampleClass)

		###

		return null

module.exports = FourOhFourPageView
