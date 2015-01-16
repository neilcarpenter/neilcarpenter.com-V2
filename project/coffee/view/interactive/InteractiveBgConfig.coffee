InteractiveBgColors = require './InteractiveBgColors'

class InteractiveBgConfig

	@colors : InteractiveBgColors.colors

	@palettes      : 'flat' : 'FLAT', 'b&w' : 'BW', 'red' : 'RED', 'blue' : 'BLUE', 'green' : 'GREEN', 'yellow' : 'YELLOW'
	@basePalettes  : _.shuffle ['RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE']
	@activePalette : 'FLAT'

	@shapeTypes: [
		{
			type   : 'Circle'
			active : true
		}
		{
			type   : 'Square'
			active : true
		}
		{
			type   : 'Triangle'
			active : true
		}
	]

	@shapes :
		MIN_WIDTH_PERC : 3
		MAX_WIDTH_PERC : 7

		# set this depending on viewport size
		MIN_WIDTH : 30
		MAX_WIDTH : 70

		MIN_SPEED_MOVE : 2
		MAX_SPEED_MOVE : 3.5

		MIN_SPEED_ROTATE : -0.01
		MAX_SPEED_ROTATE : 0.01

		MIN_ALPHA : 1
		MAX_ALPHA : 1

		MIN_BLUR : 0
		MAX_BLUR : 10

	@general : 
		GLOBAL_SPEED        : 1
		GLOBAL_ALPHA        : 0.8
		MAX_SHAPE_COUNT     : 200
		INITIAL_SHAPE_COUNT : 10
		DIRECTION_RATIO     : x : 1, y : 1

	@layers :
		BACKGROUND : 'BACKGROUND'
		MIDGROUND  : 'MIDGROUND'
		FOREGROUND : 'FOREGROUND'

	@filters :
		blur  : false
		RGB   : false
		pixel : false

	@filterDefaults :
		blur :
			general    : 10
			foreground : 0
			midground  : 0
			background : 0
		RGB :
			red   : x : 2, y : 2
			green : x : -2, y : 2
			blue  : x : 2, y : -2
		pixel :
			amount : x : 4, y : 4

	@interaction :
		MOUSE_RADIUS         : 800
		DISPLACEMENT_MAX_INC : 0.2
		DISPLACEMENT_DECAY   : 0.01

	@getRandomColor : ->

		return @colors[@activePalette][_.random(0, @colors[@activePalette].length-1)]

	@getRandomShape : ->

		activeShapes = _.filter @shapeTypes, (s) -> s.active

		return activeShapes[_.random(0, activeShapes.length-1)].type

window.InteractiveBgConfig=InteractiveBgConfig
module.exports = InteractiveBgConfig
