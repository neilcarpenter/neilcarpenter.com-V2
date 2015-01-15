AbstractView          = require '../AbstractView'
AbstractShape         = require './shapes/AbstractShape'
NumberUtils           = require '../../utils/NumberUtils'
InteractiveBgConfig   = require './InteractiveBgConfig'
InteractiveShapeCache = require './InteractiveShapeCache'
Wrapper               = require '../base/Wrapper'

class InteractiveBg extends AbstractView

	template : 'interactive-background'

	stage    : null
	renderer : null
	layers   : {}
	
	w : 0
	h : 0

	counter : null

	mouse :
		enabled : false
		pos     : null

	EVENT_KILL_SHAPE : 'EVENT_KILL_SHAPE'

	filters :
		blur  : null
		RGB   : null
		pixel : null

	constructor : ->

		@DEBUG = false

		super

		return null

	addGui : =>

		@gui        = new dat.GUI
		@guiFolders = {}

		# @gui = new dat.GUI autoPlace : false
		# @gui.domElement.style.position = 'fixed'
		# @gui.domElement.style.top = '0px'
		# @gui.domElement.style.left = '10px'
		# document.body.appendChild @gui.domElement

		@guiFolders.generalFolder = @gui.addFolder('General')
		@guiFolders.generalFolder.add(InteractiveBgConfig.general, 'GLOBAL_SPEED', 0.5, 5).name("global speed")
		@guiFolders.generalFolder.add(InteractiveBgConfig.general, 'GLOBAL_ALPHA', 0, 1).name("global alpha")

		@guiFolders.sizeFolder = @gui.addFolder('Size')
		@guiFolders.sizeFolder.add(InteractiveBgConfig.shapes, 'MIN_WIDTH', 5, 200).name('min width')
		@guiFolders.sizeFolder.add(InteractiveBgConfig.shapes, 'MAX_WIDTH', 5, 200).name('max width')

		@guiFolders.countFolder = @gui.addFolder('Count')
		@guiFolders.countFolder.add(InteractiveBgConfig.general, 'MAX_SHAPE_COUNT', 5, 1000).name('max shapes')

		@guiFolders.shapesFolder = @gui.addFolder('Shapes')
		for shape, i in InteractiveBgConfig.shapeTypes
			@guiFolders.shapesFolder.add(InteractiveBgConfig.shapeTypes[i], 'active').name(shape.type)

		@guiFolders.blurFolder = @gui.addFolder('Blur')
		@guiFolders.blurFolder.add(InteractiveBgConfig.filters, 'blur').name("enable")
		@guiFolders.blurFolder.add(@filters.blur, 'blur', 0, 32).name("blur amount")

		@guiFolders.RGBFolder = @gui.addFolder('RGB Split')
		@guiFolders.RGBFolder.add(InteractiveBgConfig.filters, 'RGB').name("enable")
		@guiFolders.RGBFolder.add(@filters.RGB.uniforms.red.value, 'x', -20, 20).name("red x")
		@guiFolders.RGBFolder.add(@filters.RGB.uniforms.red.value, 'y', -20, 20).name("red y")
		@guiFolders.RGBFolder.add(@filters.RGB.uniforms.green.value, 'x', -20, 20).name("green x")
		@guiFolders.RGBFolder.add(@filters.RGB.uniforms.green.value, 'y', -20, 20).name("green y")
		@guiFolders.RGBFolder.add(@filters.RGB.uniforms.blue.value, 'x', -20, 20).name("blue x")
		@guiFolders.RGBFolder.add(@filters.RGB.uniforms.blue.value, 'y', -20, 20).name("blue y")

		@guiFolders.pixelateFolder = @gui.addFolder('Pixellate')
		@guiFolders.pixelateFolder.add(InteractiveBgConfig.filters, 'pixel').name("enable")
		@guiFolders.pixelateFolder.add(@filters.pixel.size, 'x', 1, 32).name("pixel size x")
		@guiFolders.pixelateFolder.add(@filters.pixel.size, 'y', 1, 32).name("pixel size y")

		@guiFolders.paletteFolder = @gui.addFolder('Colour palette')
		@guiFolders.paletteFolder.add(InteractiveBgConfig, 'activePalette', InteractiveBgConfig.palettes).name("palette")

		null

	addStats : =>

		@stats = new Stats
		@stats.domElement.style.position = 'absolute'
		@stats.domElement.style.left = '0px'
		@stats.domElement.style.top = '0px'
		document.body.appendChild @stats.domElement

		null

	addShapeCounter : =>

		@shapeCounter = document.createElement 'div'
		@shapeCounter.style.position = 'absolute'
		@shapeCounter.style.left = '100px'
		@shapeCounter.style.top = '15px'
		@shapeCounter.style.color = '#fff'
		@shapeCounter.style.textTransform = 'uppercase'
		@shapeCounter.innerHTML = "0 shapes"
		document.body.appendChild @shapeCounter

		null

	updateShapeCounter : =>

		@shapeCounter.innerHTML = "#{@_getShapeCount()} shapes"

		null

	createLayers : =>

		for layer, name of InteractiveBgConfig.layers
			@layers[name] = new PIXI.DisplayObjectContainer
			@stage.addChild @layers[name]

		null

	createStageFilters : =>

		@filters.blur  = new PIXI.BlurFilter
		@filters.RGB   = new PIXI.RGBSplitFilter
		@filters.pixel = new PIXI.PixelateFilter

		@filters.blur.blur = InteractiveBgConfig.filterDefaults.blur.general

		@filters.RGB.uniforms.red.value   = InteractiveBgConfig.filterDefaults.RGB.red
		@filters.RGB.uniforms.green.value = InteractiveBgConfig.filterDefaults.RGB.green
		@filters.RGB.uniforms.blue.value  = InteractiveBgConfig.filterDefaults.RGB.blue

		@filters.pixel.uniforms.pixelSize.value = InteractiveBgConfig.filterDefaults.pixel.amount

		null

	init: =>

		PIXI.dontSayHello = true

		@setDims()
		@setStreamDirection()

		@shapes   = []
		@stage    = new PIXI.Stage 0x1A1A1A
		@renderer = PIXI.autoDetectRenderer @w, @h, antialias : true
		@render()

		InteractiveShapeCache.createCache()

		@createLayers()
		@createStageFilters()

		if @DEBUG
			@addGui()
			@addStats()
			@addShapeCounter()

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
			layer  = shape.getLayer()

			sprite.position.x = sprite._position.x = pos.x
			sprite.position.y = sprite._position.y = pos.y

			@layers[layer].addChild sprite

			@shapes.push shape

		null

	_getShapeStartPos : =>

		x = (NumberUtils.getRandomFloat @w3, @w) + (@w3*2)
		y = (NumberUtils.getRandomFloat 0, (@h3*2)) - @h3*2

		return {x, y}

	_getShapeCount : =>

		count = 0
		(count+=displayContainer.children.length) for layer, displayContainer of @layers

		count

	removeShape : (shape) =>

		index = @shapes.indexOf shape
		# @shapes.splice index, 1
		@shapes[index] = null

		layerParent = @layers[shape.getLayer()]
		layerParent.removeChild shape.s

		if @_getShapeCount() < InteractiveBgConfig.general.MAX_SHAPE_COUNT then @addShapes 1

		null

	update : =>

		if window.STOP then return requestAnimFrame @update

		if @DEBUG then @stats.begin()

		@counter++

		if (@counter % 4 is 0) and (@_getShapeCount() < InteractiveBgConfig.general.MAX_SHAPE_COUNT) then @addShapes 1

		@updateShapes()
		@render()

		filtersToApply = []
		(filtersToApply.push @filters[filter] if enabled) for filter, enabled of InteractiveBgConfig.filters

		@stage.filters = if filtersToApply.length then filtersToApply else null

		requestAnimFrame @update

		if @DEBUG
			@updateShapeCounter()
			@stats.end()

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

		@mouse.multiplier = 1
		@mouse.pos        = x : e.pageX, y : e.pageY
		@mouse.enabled    = true

		null

	setDims : =>

		@w = @NC().appView.dims.w
		@h = @NC().appView.dims.h

		@w3 = @w/3
		@h3 = @h/3

		# just use non-relative sizes for now
		# InteractiveBgConfig.shapes.MIN_WIDTH = (InteractiveBgConfig.shapes.MIN_WIDTH_PERC/100)*@NC().appView.dims.w
		# InteractiveBgConfig.shapes.MAX_WIDTH = (InteractiveBgConfig.shapes.MAX_WIDTH_PERC/100)*@NC().appView.dims.w

		@setStreamDirection()

		@renderer?.resize @w, @h

		null

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
