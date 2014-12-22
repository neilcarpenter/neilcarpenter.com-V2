# rect class with x,y,w,h spec

class Rect2
	constructor: ( @x=0, @y=0, @width=0, @height=0 ) ->

	hitTest: ( r ) ->
		return ( r.x + r.width >= @x) and (r.x <= @x + @width) and ( r.y + r.height >= @y) and (r.y <= @y + @height)

module.exports = Rect2