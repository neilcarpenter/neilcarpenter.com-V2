AbstractView        = require '../AbstractView'
AbstractShape       = require './shapes/AbstractShape'
NumberUtils         = require '../../utils/NumberUtils'
InteractiveBgConfig = require './InteractiveBgConfig'

class InteractiveBg extends AbstractView

	template : 'interactive-background'

	stage  : null
	layers : {}

	renderer : null
	
	w : 0
	h : 0

	counter : null

	EVENT_KILL_SHAPE : 'EVENT_KILL_SHAPE'

	filters :
		blur  : null
		RGB   : null
		pixel : null

	constructor : ->

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

		@shapes   = []
		@stage    = new PIXI.Stage 0x1A1A1A
		@renderer = PIXI.autoDetectRenderer @w, @h, antialias : true

		@createLayers()
		@createStageFilters()

		@addGui()
		@addStats()

		@$el.append @renderer.view

		@draw()

		null

	draw : =>

		@counter = 0

		@bindEvents()
		@setDims()

		null

	show : =>

		@addShapes InteractiveBgConfig.general.INITIAL_SHAPE_COUNT
		@update()

		null

	addShapes : (count) =>

		for i in [0...count]

			pos = @_getShapeStartPos()

			shape  = new AbstractShape @
			sprite = shape.getSprite()
			layer  = shape.getLayer()

			sprite.position.x = pos.x
			sprite.position.y = pos.y

			@layers[layer].addChild sprite

			@shapes.push shape

		null

	_getShapeStartPos : =>

		x = (NumberUtils.getRandomFloat @w4, @w) + (@w4*3)
		y = (NumberUtils.getRandomFloat 0, (@h4*3)) - @h4*3

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

		@stats.begin()

		@counter++

		if (@counter % 4 is 0) and (@_getShapeCount() < InteractiveBgConfig.general.MAX_SHAPE_COUNT) then @addShapes 1

		@updateShapes()
		@render()

		filtersToApply = []
		(filtersToApply.push @filters[filter] if enabled) for filter, enabled of InteractiveBgConfig.filters

		@stage.filters = if filtersToApply.length then filtersToApply else null

		requestAnimFrame @update

		@stats.end()

		null

	updateShapes : =>

		(shape?.callAnimate()) for shape in @shapes

		null

	render : =>

		@renderer.render @stage 

		null

	bindEvents : =>

		@NC().appView.on @NC().appView.EVENT_UPDATE_DIMENSIONS, @setDims
		@on @EVENT_KILL_SHAPE, @removeShape

		null

	setDims : =>

		@w = @NC().appView.dims.w
		@h = @NC().appView.dims.h

		@w2 = @w/2
		@h2 = @h/2

		@w2 = @w/2
		@h2 = @h/2

		@w4 = @w/4
		@h4 = @h/4

		@renderer?.resize @w, @h

		null

module.exports = InteractiveBg
