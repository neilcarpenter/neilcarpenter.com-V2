class AbstractView extends Backbone.View

	el           : null
	id           : null
	children     : null
	template     : null
	templateVars : null

	# coz on page load we already have the DOM for a page, it will get initialised twice - once on construction, and once when page has "loaded"
	initialized : false
	
	initialize : (force) ->

		return unless !@initialized or force
		
		@children = []

		if @template
			$tmpl = @NC().appView.$el.find("[data-template=\"#{@template}\"]")
			@setElement $tmpl
			return unless $tmpl.length

		@$el.attr 'id', @id if @id
		@$el.addClass @className if @className
		
		@initialized = true
		@init()

		@paused = false

		null

	init : =>

		null

	update : =>

		null

	render : =>

		null

	addChild : (child, prepend = false) =>

		@children.push child if child.el

		@

	replace : (dom, child) =>

		@children.push child if child.el
		c = if child.el then child.$el else child
		@$el.children(dom).replaceWith(c)

		null

	remove : (child) =>

		unless child?
			return
		
		c = if child.el then child.$el else $(child)
		child.dispose() if c and child.dispose

		if c && @children.indexOf(child) != -1
			@children.splice( @children.indexOf(child), 1 )

		c.remove()

		null

	onResize : (event) =>

		(if child.onResize then child.onResize()) for child in @children

		null

	mouseEnabled : ( enabled ) =>

		@$el.css
			"pointer-events": if enabled then "auto" else "none"

		null

	CSSTranslate : (x, y, value='%', scale) =>

		if Modernizr.csstransforms3d
			str = "translate3d(#{x+value}, #{y+value}, 0)"
		else
			str = "translate(#{x+value}, #{y+value})"

		if scale then str = "#{str} scale(#{scale})"

		str

	unMuteAll : =>

		for child in @children

			child.unMute?()

			if child.children.length

				child.unMuteAll()

		null

	muteAll : =>

		for child in @children

			child.mute?()

			if child.children.length

				child.muteAll()

		null

	removeAllChildren: =>

		@remove child for child in @children

		null

	triggerChildren : (msg, children=@children) =>

		for child, i in children

			child.trigger msg

			if child.children.length

				@triggerChildren msg, child.children

		null

	callChildren : (method, params, children=@children) =>

		for child, i in children

			child[method]? params

			if child.children.length

				@callChildren method, params, child.children

		null

	callChildrenAndSelf : (method, params, children=@children) =>

		@[method]? params

		for child, i in children

			child[method]? params

			if child.children.length

				@callChildren method, params, child.children

		null

	supplantString : (str, vals) ->

		return str.replace /{{ ([^{}]*) }}/g, (a, b) ->
			r = vals[b]
			(if typeof r is "string" or typeof r is "number" then r else a)

	dispose : =>

		@stopListening()

		null

	NC : =>

		return window.NC

module.exports = AbstractView
