AbstractViewPage = require '../../AbstractViewPage'

class HomePageView extends AbstractViewPage

	template : 'page-home'

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

module.exports = HomePageView
