AbstractViewPage = require '../../AbstractViewPage'

class ProjectPageView extends AbstractViewPage

	template : 'page-project'

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

module.exports = ProjectPageView