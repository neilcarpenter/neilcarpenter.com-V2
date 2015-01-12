AbstractViewPage = require '../../AbstractViewPage'

class ContactPageView extends AbstractViewPage

	template : 'page-contact'

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

module.exports = ContactPageView
