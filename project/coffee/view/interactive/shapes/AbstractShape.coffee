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

	displacement : 0

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

		# track natural, non-displaced positioning
		@s._position = x : 0, y : 0

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

	_getDisplacement : (axis) =>

		return 0 unless @interactiveBg.mouse.enabled

		dist = @interactiveBg.mouse.pos[axis]-@s.position[axis]
		dist = if dist < 0 then -dist else dist

		if dist < InteractiveBgConfig.interaction.MOUSE_RADIUS
			strength = (InteractiveBgConfig.interaction.MOUSE_RADIUS - dist) / InteractiveBgConfig.interaction.MOUSE_RADIUS
			value    = (InteractiveBgConfig.interaction.DISPLACEMENT_MAX_INC*InteractiveBgConfig.general.GLOBAL_SPEED*strength)
			@displacement = if @s.position[axis] > @interactiveBg.mouse.pos[axis] then @displacement-value else @displacement+value
		
		if @displacement isnt 0
			if @displacement > 0
				@displacement-=InteractiveBgConfig.interaction.DISPLACEMENT_DECAY
				@displacement = if @displacement < 0 then 0 else @displacement
			else
				@displacement+=InteractiveBgConfig.interaction.DISPLACEMENT_DECAY
				@displacement = if @displacement > 0 then 0 else @displacement

		@displacement

	callAnimate : =>

		return unless !@dead

		@s.alpha = @alphaValue*InteractiveBgConfig.general.GLOBAL_ALPHA

		@s._position.x -= (@speedMove*InteractiveBgConfig.general.GLOBAL_SPEED)*InteractiveBgConfig.general.DIRECTION_RATIO.x
		@s._position.y += (@speedMove*InteractiveBgConfig.general.GLOBAL_SPEED)*InteractiveBgConfig.general.DIRECTION_RATIO.y

		@s.position.x = @s._position.x+@_getDisplacement('x')
		@s.position.y = @s._position.y+@_getDisplacement('y')

		@s.rotation += @speedRotate*InteractiveBgConfig.general.GLOBAL_SPEED

		if (@s.position.x + (@width/2) < 0) or (@s.position.y - (@width/2) > @NC().appView.dims.h) then @kill()

		null

	kill : =>

		@dead = true

		@interactiveBg.trigger @interactiveBg.EVENT_KILL_SHAPE, @

	getSprite : =>

		return @s

	NC : =>

		return window.NC

module.exports = AbstractShape
