InteractiveBgColors = require './InteractiveBgColors'

class InteractiveBgConfig

	@colors        : InteractiveBgColors.colors
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

	@general : 
		GLOBAL_SPEED            : 1
		GLOBAL_SPEED_NORMAL     : 1
		GLOBAL_SPEED_TRANSITION : 4
		GLOBAL_ALPHA            : 0.8
		DIRECTION_RATIO         : x : 1, y : 1

	@shapes :
		desktop :
			MIN_WIDTH : 30
			MAX_WIDTH : 70

			MIN_SPEED_MOVE : 2
			MAX_SPEED_MOVE : 3.5

			MIN_SPEED_ROTATE : -0.01
			MAX_SPEED_ROTATE : 0.01

			MIN_ALPHA : 1
			MAX_ALPHA : 1

		mobile :
			MIN_WIDTH : 20
			MAX_WIDTH : 40

			MIN_SPEED_MOVE : 2
			MAX_SPEED_MOVE : 3.5

			MIN_SPEED_ROTATE : -0.01
			MAX_SPEED_ROTATE : 0.01

			MIN_ALPHA : 1
			MAX_ALPHA : 1

	@count :
		desktop :
			INITIAL_SHAPE_COUNT    : 10
			MAX_SHAPE_COUNT_FULL   : 300
			MAX_SHAPE_COUNT_MED    : 200
			MAX_SHAPE_COUNT_SPARSE : 80

		mobile :
			INITIAL_SHAPE_COUNT    : 10
			MAX_SHAPE_COUNT_FULL   : 80
			MAX_SHAPE_COUNT_MED    : 50
			MAX_SHAPE_COUNT_SPARSE : 25

	@alpha :
		desktop :
			FULL   : 0.8
			MED    : 0.5
			SPARSE : 0.4

		mobile :
			FULL   : 0.7
			MED    : 0.4
			SPARSE : 0.4

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
