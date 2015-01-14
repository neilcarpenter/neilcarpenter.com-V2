AbstractView        = require '../AbstractView'
AbstractShape       = require './shapes/AbstractShape'
NumberUtils         = require '../../utils/NumberUtils'
InteractiveBgConfig = require './InteractiveBgConfig'

class InteractiveBg extends AbstractView

	template : 'interactive-background'
	stage    : null
	renderer : null
	
	w : 0
	h : 0

	EVENT_KILL_SHAPE : 'EVENT_KILL_SHAPE'

	filters :
		blur : null

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

		@guiFolders.speedFolder = @gui.addFolder('Speed')
		@guiFolders.speedFolder.add(InteractiveBgConfig.general, 'GLOBAL_SPEED', 0.5, 5).name("global speed")

		@guiFolders.sizeFolder = @gui.addFolder('Size')
		@guiFolders.sizeFolder.add(InteractiveBgConfig.shapes, 'MIN_WIDTH', 5, 200).name('min width')
		@guiFolders.sizeFolder.add(InteractiveBgConfig.shapes, 'MAX_WIDTH', 5, 200).name('max width')

		@guiFolders.countFolder = @gui.addFolder('Count')
		@guiFolders.countFolder.add(InteractiveBgConfig.general, 'MAX_SHAPE_COUNT', 5, 500).name('max shapes')

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

		null

	addStats : =>

		@stats = new Stats
		@stats.domElement.style.position = 'absolute'
		@stats.domElement.style.left = '0px'
		@stats.domElement.style.top = '0px'
		document.body.appendChild @stats.domElement

		null

	init: =>

		PIXI.dontSayHello = true

		@w = @NC().appView.dims.w
		@h = @NC().appView.dims.h

		@w2 = @w/2
		@h2 = @h/2

		@w2 = @w/2
		@h2 = @h/2

		@w4 = @w/4
		@h4 = @h/4

		@shapes   = []
		@stage    = new PIXI.Stage 0x1A1A1A
		@renderer = PIXI.autoDetectRenderer @w, @h, antialias : true

		@filters.blur  = new PIXI.BlurFilter
		@filters.RGB   = new PIXI.RGBSplitFilter
		@filters.pixel = new PIXI.PixelateFilter

		@$el.append @renderer.view

		@addGui()
		@addStats()

		@draw()

		null

	draw : =>

		@bindEvents()
		@setDims()

		null

	show : =>

		@addShapes InteractiveBgConfig.general.MAX_SHAPE_COUNT
		@update()

		null

	addShapes : (count) =>

		for i in [0...count]

			pos = @_getShapeStartPos()

			shape = new AbstractShape @
			shape.s.position.x = pos.x
			shape.s.position.y = pos.y

			@stage.addChild shape.s

			@shapes.push shape

		null

	_getShapeStartPos : =>

		x = (NumberUtils.getRandomFloat @w4, @w) + (@w4*3)
		y = (NumberUtils.getRandomFloat 0, (@h4*3)) - @h4*3

		return {x, y}

	removeShape : (shape) =>

		index = @shapes.indexOf shape
		# @shapes.splice index, 1
		@shapes[index] = null

		@stage.removeChild shape.s

		if @stage.children.length < InteractiveBgConfig.general.MAX_SHAPE_COUNT then @addShapes 1

		null

	update : =>

		@stats.begin()

		@updateShapes()
		@render()

		filtersToApply = []
		for filter, enabled of InteractiveBgConfig.filters
			(filtersToApply.push @filters[filter] if enabled)

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

		@renderer.resize @w, @h

		null

module.exports = InteractiveBg
