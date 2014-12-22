AbstractViewPage = require '../../AbstractViewPage'

class AboutPageView extends AbstractViewPage

	template : 'page-about'

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

module.exports = AboutPageView
