InteractiveBgConfig   = require '../InteractiveBgConfig'
InteractiveShapeCache = require '../InteractiveShapeCache'
NumberUtils           = require '../../../utils/NumberUtils'

class AbstractShape

	s : null

	_shape : null
	_color : null

	width       : null
	speedMove   : null
	speedRotate : null
	alphaValue  : null

	dead : false

	@triangleRatio : Math.cos(Math.PI/6)

	constructor : (@interactiveBg) ->

		_.extend @, Backbone.Events

		@_shape = InteractiveBgConfig.getRandomShape()
		@_color = InteractiveBgConfig.getRandomColor()

		@width       = @_getWidth()
		@height      = @_getHeight @_shape, @width
		@speedMove   = @_getSpeedMove()
		@speedRotate = @_getSpeedRotate()
		@alphaValue  = @_getAlphaValue()

		@s = new PIXI.Sprite.fromImage InteractiveShapeCache.shapes[@_shape][@_color]

		@s.width     = @width
		@s.height    = @height
		@s.blendMode = PIXI.blendModes.ADD
		@s.alpha     = @alphaValue
		@s.anchor.x  = @s.anchor.y = 0.5

		return null

	_getWidth : =>

		NumberUtils.getRandomFloat InteractiveBgConfig.shapes.MIN_WIDTH, InteractiveBgConfig.shapes.MAX_WIDTH

	_getHeight : (shape, width) =>

		height = switch true
			when shape is 'Triangle' then (width * AbstractShape.triangleRatio)
			else width

		height

	_getSpeedMove : =>

		NumberUtils.getRandomFloat InteractiveBgConfig.shapes.MIN_SPEED_MOVE, InteractiveBgConfig.shapes.MAX_SPEED_MOVE

	_getSpeedRotate : =>

		NumberUtils.getRandomFloat InteractiveBgConfig.shapes.MIN_SPEED_ROTATE, InteractiveBgConfig.shapes.MAX_SPEED_ROTATE

	_getAlphaValue : =>

		range = InteractiveBgConfig.shapes.MAX_ALPHA - InteractiveBgConfig.shapes.MIN_ALPHA
		alpha = ((@width / InteractiveBgConfig.shapes.MAX_WIDTH) * range) + InteractiveBgConfig.shapes.MIN_ALPHA

		alpha

	callAnimate : =>

		return unless !@dead

		@s.alpha = @alphaValue*InteractiveBgConfig.general.GLOBAL_ALPHA

		@s.position.x -= @speedMove*InteractiveBgConfig.general.GLOBAL_SPEED
		@s.position.y += @speedMove*InteractiveBgConfig.general.GLOBAL_SPEED
		@s.rotation += @speedRotate*InteractiveBgConfig.general.GLOBAL_SPEED

		if (@s.position.x + (@width/2) < 0) or (@s.position.y - (@width/2) > @NC().appView.dims.h) then @kill()

		null

	kill : =>

		@dead = true

		@interactiveBg.trigger @interactiveBg.EVENT_KILL_SHAPE, @

	getSprite : =>

		return @s

	getLayer : =>

		range = InteractiveBgConfig.shapes.MAX_WIDTH - InteractiveBgConfig.shapes.MIN_WIDTH

		layer = switch true
			when @width < (range / 3)+InteractiveBgConfig.shapes.MIN_WIDTH then InteractiveBgConfig.layers.BACKGROUND
			when @width < ((range / 3) * 2)+InteractiveBgConfig.shapes.MIN_WIDTH then InteractiveBgConfig.layers.MIDGROUND
			else InteractiveBgConfig.layers.FOREGROUND

		layer

	NC : =>

		return window.NC

module.exports = AbstractShape
