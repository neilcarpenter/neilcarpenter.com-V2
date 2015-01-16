AbstractView          = require '../AbstractView'
AbstractShape         = require './shapes/AbstractShape'
NumberUtils           = require '../../utils/NumberUtils'
InteractiveBgConfig   = require './InteractiveBgConfig'
InteractiveShapeCache = require './InteractiveShapeCache'
Router                = require '../../router/Router'
Wrapper               = require '../base/Wrapper'

class InteractiveBg extends AbstractView

	template : 'interactive-background'

	_device     : null
	_population : null

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

	DEVICE_MOBILE  : 'mobile'
	DEVICE_DESKTOP : 'desktop'

	POPULATION_FULL   : 'FULL'
	POPULATION_MEDIUM : 'MED'
	POPULATION_SPARSE : 'SPARSE'

	constructor : ->

		super

		return null

	init: =>

		PIXI.dontSayHello = true

		@setDevice()
		@setDims()
		@setStreamDirection()

		InteractiveShapeCache.createCache @

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
		@onHashChange false
		@onViewUpdated false

		@addShapes InteractiveBgConfig.general.INITIAL_SHAPE_COUNT
		@update()

		null

	addShapes : (count) =>

		for i in [0...count]

			shape  = new AbstractShape @

			@_positionShape shape

			@container.addChild shape.getSprite()

			@shapes.push shape

		null

	_positionShape : (shape) =>

		pos = @_getShapeStartPos()

		sprite            = shape.getSprite()
		sprite.position.x = sprite._position.x = pos.x
		sprite.position.y = sprite._position.y = pos.y

		null

	_getShapeStartPos : =>

		x = (NumberUtils.getRandomFloat @w3, @w) + (@w3*2)
		y = (NumberUtils.getRandomFloat 0, (@h3*2)) - @h3*2

		return {x, y}

	_getShapeCount : =>

		@container.children.length

	onShapeDie : (shape) =>

		if @_getShapeCount() > @_getViewShapeCount()
			@removeShape shape
		else
			@resetShape shape

		null

	resetShape : (shape) =>

		shape.reset()
		@_positionShape shape

		null

	removeShape : (shape) =>

		index = @shapes.indexOf shape
		@shapes[index] = null

		@container.removeChild shape.getSprite()

		null

	update : =>

		if window.STOP then return requestAnimFrame @update

		@counter++

		if (@counter % 4 is 0) and (@_getShapeCount() < @_getViewShapeCount()) then @addShapes 1

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
		@NC().router.on Router.EVENT_HASH_CHANGED, @onHashChange
		@NC().appView.wrapper.on Wrapper.VIEW_UPDATED, @onViewUpdated

		@on @EVENT_KILL_SHAPE, @onShapeDie

		null

	onHashChange : (route=false) =>

		@setPopulation()

		alpha = @_getViewAlpha()

		if typeof route is 'string'
			@_transitionIn()
		else
			InteractiveBgConfig.general.GLOBAL_ALPHA = alpha

		null

	onViewUpdated : (transitionOut=true) =>

		palette = @_getViewPalette()

		InteractiveBgConfig.activePalette = palette

		if transitionOut
			@_transitionOut()

		null

	_transitionIn : =>

		console.log "_transitionIn : =>"

		alpha = @_getViewAlpha()

		TweenLite.to InteractiveBgConfig.general, 1, 'GLOBAL_ALPHA' : alpha
		TweenLite.to InteractiveBgConfig.general, 2, 'GLOBAL_SPEED' : InteractiveBgConfig.general.GLOBAL_SPEED_TRANSITION

		null

	_transitionOut : =>

		console.log "_transitionOut : =>"

		TweenLite.to InteractiveBgConfig.general, 2, delay : 1, 'GLOBAL_SPEED' : InteractiveBgConfig.general.GLOBAL_SPEED_NORMAL

		null

	_getViewShapeCount : =>

		InteractiveBgConfig.count[@_device]["MAX_SHAPE_COUNT_#{@_population}"]

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

		InteractiveBgConfig.alpha[@_device][@_population]

	onMouseMove : (e) =>

		@mouse.pos     = x : e.pageX, y : e.pageY
		@mouse.enabled = true

		null

	setDevice : =>

		@_device = if @NC().isMobile() then @DEVICE_MOBILE else @DEVICE_DESKTOP

		null

	setPopulation : =>

		@_population = switch @NC().router.area
			when @NC().nav.sections.HOME then @POPULATION_FULL
			when @NC().nav.sections.WORK then @POPULATION_SPARSE
			else @POPULATION_MEDIUM

		null

	setDims : =>

		@w = @NC().appView.dims.w
		@h = @NC().appView.dims.h*@_getHeightBuffer()

		@w3 = @w/3
		@h3 = @h/3

		@setStreamDirection()

		# prevent annoying resize changes on mobile when browser UI hides itself
		if @NC().appView.dims.updateMobile then @renderer?.resize @w, @h

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
