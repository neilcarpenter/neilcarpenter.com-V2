class InteractiveBgConfig

	# http://flatuicolors.com/
	@COLORS : [
		'19B698',
		'2CC36B',
		'2E8ECE',
		'9B50BA',
		'E98B39',
		'EA6153',
		'F2CA27'
	]

	@COLORS_BW : [
		'E8E8E8',
		'D1D1D1',
		'B9B9B9',
		'A3A3A3',
		'8C8C8C',
		'767676',
		'5E5E5E'
	]

	@activePalette : @COLORS_BW

	@getRandomColor : ->

		return @activePalette[_.random(0, @COLORS.length-1)]

	@shapes :
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
		MAX_SHAPE_COUNT     : 80
		INITIAL_SHAPE_COUNT : 10

	@filters :
		blur  : false
		RGB   : false
		pixel : false

	@filterDefaults :
		blur :
			amount : 10
		RGB :
			red   : x : 2, y : 2
			green : x : -2, y : 2
			blue  : x : 2, y : -2
		pixel :
			amount : x : 4, y : 4

module.exports = InteractiveBgConfig
