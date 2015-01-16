InteractiveBgConfig = require './InteractiveBgConfig'
AbstractShape       = require './shapes/AbstractShape'

class InteractiveShapeCache

	@shapes : {}

	@triangleRatio : Math.cos(Math.PI/6)

	@createCache : ->

		# counter = 0
		# startTime = Date.now()

		(@shapes[shape.type] = {}) for shape in InteractiveBgConfig.shapeTypes

		for palette, paletteColors of InteractiveBgConfig.colors
			for color in paletteColors
				for shape, colors of @shapes
					# counter++
					@shapes[shape][color] = new PIXI.Texture.fromImage @_createShape shape, color


		# timeTaken = Date.now()-startTime
		# console.log "#{counter} shape caches created in #{timeTaken}ms"

		null

	@_createShape : (shape, color) ->

		height = @_getHeight shape, InteractiveBgConfig.shapes.MAX_WIDTH

		c        = document.createElement('canvas')
		c.width  = InteractiveBgConfig.shapes.MAX_WIDTH
		c.height = height

		ctx = c.getContext('2d')
		ctx.fillStyle = '#'+color
		ctx.beginPath()

		@["_draw#{shape}"] ctx, height

		ctx.closePath()
		ctx.fill()

		return c.toDataURL()

	@_drawSquare : (ctx, height) ->

		ctx.moveTo(0, 0)
		ctx.lineTo(0, height)
		ctx.lineTo(InteractiveBgConfig.shapes.MAX_WIDTH, height)
		ctx.lineTo(InteractiveBgConfig.shapes.MAX_WIDTH, 0)
		ctx.lineTo(0, 0)

		null

	@_drawTriangle : (ctx, height) ->

		ctx.moveTo(InteractiveBgConfig.shapes.MAX_WIDTH/2, 0)
		ctx.lineTo(0,height)
		ctx.lineTo(InteractiveBgConfig.shapes.MAX_WIDTH, height)
		ctx.lineTo(InteractiveBgConfig.shapes.MAX_WIDTH/2, 0)

		null

	@_drawCircle : (ctx) ->

		halfWidth = InteractiveBgConfig.shapes.MAX_WIDTH/2

		ctx.arc(halfWidth, halfWidth, halfWidth, 0, 2*Math.PI)

		null

	@_getHeight : (shape, width) =>

		height = switch true
			when shape is 'Triangle' then (width * @triangleRatio)
			else width

		height

window.InteractiveShapeCache=InteractiveShapeCache
module.exports = InteractiveShapeCache
