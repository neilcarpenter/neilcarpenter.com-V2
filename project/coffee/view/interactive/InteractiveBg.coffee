AbstractView          = require '../AbstractView'
AbstractShape         = require './shapes/AbstractShape'
NumberUtils           = require '../../utils/NumberUtils'
InteractiveBgConfig   = require './InteractiveBgConfig'
InteractiveShapeCache = require './InteractiveShapeCache'
Wrapper               = require '../base/Wrapper'

class InteractiveBg extends AbstractView

	template : 'interactive-background'

	stage     : null
	renderer  : null
	container : null
	
	w : 0
	h : 0

	counter : null

	mouse :
		enabled : false
		pos     : null

	EVENT_KILL_SHAPE : 'EVENT_KILL_SHAPE'

	constructor : ->

		super

		return null

	init: =>

		PIXI.dontSayHello = true

		@setDims()
		@setStreamDirection()

		InteractiveShapeCache.createCache()

		@shapes   = []
		@stage    = new PIXI.Stage 0x1A1A1A
		@renderer = PIXI.autoDetectRenderer @w, @h, antialias : true

		@container = new PIXI.DisplayObjectContainer
		@stage.addChild @container

		@render()

		@$el.append @renderer.view

		@draw()

		null

	draw : =>

		@counter = 0

		@setDims()

		null

	show : =>

		@bindEvents()
		@onViewUpdated false

		@addShapes InteractiveBgConfig.general.INITIAL_SHAPE_COUNT
		@update()

		null

	addShapes : (count) =>

		for i in [0...count]

			pos = @_getShapeStartPos()

			shape  = new AbstractShape @
			sprite = shape.getSprite()

			sprite.position.x = sprite._position.x = pos.x
			sprite.position.y = sprite._position.y = pos.y

			@container.addChild sprite

			@shapes.push shape

		null

	_getShapeStartPos : =>

		x = (NumberUtils.getRandomFloat @w3, @w) + (@w3*2)
		y = (NumberUtils.getRandomFloat 0, (@h3*2)) - @h3*2

		return {x, y}

	_getShapeCount : =>

		@container.children.length

	removeShape : (shape) =>

		index = @shapes.indexOf shape
		@shapes[index] = null

		@container.removeChild shape.getSprite()

		if @_getShapeCount() < InteractiveBgConfig.general.MAX_SHAPE_COUNT then @addShapes 1

		null

	update : =>

		if window.STOP then return requestAnimFrame @update

		@counter++

		if (@counter % 4 is 0) and (@_getShapeCount() < InteractiveBgConfig.general.MAX_SHAPE_COUNT) then @addShapes 1

		@updateShapes()
		@render()

		requestAnimFrame @update

		null

	updateShapes : =>

		(shape?.callAnimate()) for shape in @shapes

		null

	render : =>

		@renderer.render @stage 

		null

	bindEvents : =>

		@NC().appView.$window.on 'mousemove', @onMouseMove

		@NC().appView.on @NC().appView.EVENT_UPDATE_DIMENSIONS, @setDims
		@NC().appView.wrapper.on Wrapper.VIEW_UPDATED, @onViewUpdated

		@on @EVENT_KILL_SHAPE, @removeShape

		null

	onViewUpdated : (transitionIn=true) =>

		shapeCount = @_getViewShapeCount()
		palette    = @_getViewPalette()
		alpha      = @_getViewAlpha()

		InteractiveBgConfig.activePalette           = palette
		InteractiveBgConfig.general.MAX_SHAPE_COUNT = shapeCount

		if transitionIn
			TweenLite.to InteractiveBgConfig.general, 1, 'GLOBAL_ALPHA' : alpha
			TweenLite.to InteractiveBgConfig.general, 2, 'GLOBAL_SPEED' : InteractiveBgConfig.general.GLOBAL_SPEED*4, ease : Back.easeInOut, onComplete : =>
				TweenLite.to InteractiveBgConfig.general, 2, 'GLOBAL_SPEED' : InteractiveBgConfig.general.GLOBAL_SPEED/4
		else
			InteractiveBgConfig.general.GLOBAL_ALPHA = alpha

		null

	_getViewShapeCount : =>

		s = switch @NC().router.area
			when @NC().nav.sections.HOME then 300
			when @NC().nav.sections.WORK then 80
			else 200

		s

	_getViewPalette : =>

		basePalettes    = InteractiveBgConfig.basePalettes
		currentColorIdx = basePalettes.indexOf InteractiveBgConfig.activePalette
		currentColorIdx = if currentColorIdx > -1 then currentColorIdx else currentColorIdx
		newColorIdx     = if currentColorIdx is basePalettes.length-1 then 0 else currentColorIdx+1

		if @NC().appView.wrapper.currentView.$el.find('[data-palette]').length
			p = @NC().appView.wrapper.currentView.$el.find('[data-palette]').attr('data-palette')
		else if @NC().router.area is @NC().nav.sections.HOME
			p = 'FLAT'
		else
			p = basePalettes[newColorIdx]

		p

	_getViewAlpha : =>

		a = switch @NC().router.area
			when @NC().nav.sections.HOME then 0.8
			when @NC().nav.sections.WORK then 0.4
			else 0.6

		a

	onMouseMove : (e) =>

		@mouse.pos     = x : e.pageX, y : e.pageY
		@mouse.enabled = true

		null

	setDims : =>

		@w = @NC().appView.dims.w
		@h = @NC().appView.dims.h*@_getHeightBuffer()

		@w3 = @w/3
		@h3 = @h/3

		@setStreamDirection()

		# prevent annoying resize changes on mobile when browser UI hides itself
		if @NC().appView.dims.updateMobile
			@renderer?.resize @w, @h

		@_lastH = @h

		null

	_getHeightBuffer : =>

		return if @NC().isMobile() then 1.2 else 1

	setStreamDirection : =>

		if @w > @h
			x = 1
			y = @h / @w
		else
			y = 1
			x = @w / @h

		InteractiveBgConfig.general.DIRECTION_RATIO = {x, y}

		null

module.exports = InteractiveBg
