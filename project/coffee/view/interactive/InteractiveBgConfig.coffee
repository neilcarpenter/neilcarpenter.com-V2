class InteractiveBgConfig

	@colors :
		# http://flatuicolors.com/
		FLAT : [
			'19B698',
			'2CC36B',
			'2E8ECE',
			'9B50BA',
			'E98B39',
			'EA6153',
			'F2CA27'
		]
		BW : [
			'E8E8E8',
			'D1D1D1',
			'B9B9B9',
			'A3A3A3',
			'8C8C8C',
			'767676',
			'5E5E5E'
		]
		RED : [
			'AA3939',
			'D46A6A',
			'FFAAAA',
			'801515',
			'550000'
		]
		# http://paletton.com/#uid=13v0u0kntS+c6XUikVtsvPzDRKa
		BLUE : [
			'9FD4F6',
			'6EBCEF',
			'48A9E8',
			'2495DE',
			'0981CF'
		]
		# http://paletton.com/#uid=12Y0u0klSLOb5VVh3QYqoG7xS-Y
		GREEN : [
			'9FF4C1',
			'6DE99F',
			'46DD83',
			'25D06A',
			'00C24F'
		]
		# http://paletton.com/#uid=11w0u0knRw0e4LEjrCEtTutuXn9
		YELLOW : [
			'FFEF8F',
			'FFE964',
			'FFE441',
			'F3D310',
			'B8A006'
		]
		# http://paletton.com/#uid=10x0u0klAw0bLO3heEoq4tzthnT
		ORANGE : [
			'FFCEA1',
			'FFB876',
			'FFA653',
			'EC882C',
			'BE6410'
		]
		# http://paletton.com/#uid=14L0u0kgDKz64Y2bLS8kNBxoMuN
		PURPLE : [
			'EACAF7',
			'D096E7',
			'B56AD3',
			'9A47BB',
			'812AA3'
		]
		# http://paletton.com/#uid=13l0u0kpZE+fyPvl6JJwMBh-Fqj
		TURQUOISE : [
			'73CFDB',
			'47BACA',
			'26A9BB',
			'26A9BB',
			'027180'
		]
		# http://paletton.com/#uid=1020u0k4xiH1Tt-3enD5ZdG9g7E
		RESONATE : [
			'ECDEDE',
			'BCAAA9',
			'958180',
			'6D5A59',
			'3D2C2B'
		]
		# http://paletton.com/#uid=10K0u0kpspJfjxRkmsbrYkAx8f-
		GOLD : [
			'FFCC85',
			'E1A552',
			'CD892A',
			'A46915',
			'7C4900'
		]

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
