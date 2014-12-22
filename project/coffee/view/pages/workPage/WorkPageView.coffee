AbstractViewPage = require '../../AbstractViewPage'

class WorkPageView extends AbstractViewPage

	template : 'page-work'

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

module.exports = WorkPageView
