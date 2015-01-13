AbstractView  = require '../AbstractView'
AbstractShape = require './shapes/AbstractShape'

class InteractiveBackground extends AbstractView

	template : 'interactive-background'
	stage    : null
	renderer : null
	
	w : 0
	h : 0

	constructor : ->

		@gui = new dat.GUI

		super

		return null

	init: =>

		PIXI.dontSayHello = true

		@w = @NC().appView.dims.w
		@h = @NC().appView.dims.h

		@stage    = new PIXI.Stage 0x1A1A1A
		@renderer = PIXI.autoDetectRenderer @w, @h, antialias : true

		@$el.append @renderer.view

		@draw()

		null

	draw : =>

		@bindEvents()
		@setDims()

		null

	show : =>

		@addShapes()
		@update()

		null

	addShapes : =>

		@shapeCount = 1

		@shapes = []

		for i in [0...@shapeCount]

			shape = new AbstractShape
			shape.g.position.x = Math.random()*@w
			shape.g.position.y = Math.random()*@h

			@stage.addChild shape.g

			@shapes.push shape

		null

	update : =>

		@updateShapes()
		@render()

		requestAnimFrame @update

		null

	updateShapes : =>

		(shape.callAnimate()) for shape in @shapes

		null

	render : =>

		@renderer.render @stage 

		null

	bindEvents : =>

		@NC().appView.on @NC().appView.EVENT_UPDATE_DIMENSIONS, @setDims

		null

	setDims : =>

		@w = @NC().appView.dims.w
		@h = @NC().appView.dims.h

		@renderer.resize @w, @h

		null

module.exports = InteractiveBackground
