class AbstractShape

	constructor : ->

		g = new PIXI.Graphics

		g.beginFill '0x'+Math.floor(Math.random()*16777215).toString(16)

		g.moveTo(0,0)
		g.lineTo(-50, 100)
		g.lineTo(50, 100)

		g.endFill()

		@g = new PIXI.Sprite g.generateTexture()

		@g.filters = [new PIXI.RGBSplitFilter]

		@g.anchor.x = @g.anchor.y = 0.5

		return null

	callAnimate : =>

		# @g.position.x += 0.1
		# @g.position.y += 0.1
		# @g.rotation += 1

		null

module.exports = AbstractShape
