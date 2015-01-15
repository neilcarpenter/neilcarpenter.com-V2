class Scroller

	@defaults :
		offset  : 0
		minTime : 0.1
		maxTime : 0.6

	@maxDist : 500

	@scrollTo : (settings, cb) =>

		offset   = settings.offset or @defaults.offset
		maxTime  = settings.maxTime or @defaults.maxTime
		minTime  = settings.minTime or @defaults.minTime
		target   = (if typeof settings.target is 'number' then settings.target else settings.target.offset().top) + offset

		distToGo = window.scrollY - target
		distToGo = if distToGo < 0 then distToGo*-1 else distToGo

		if distToGo is 0
			time = 0
		else if distToGo > @maxDist
			time = maxTime + minTime
		else
			time = ((distToGo / @maxDist) *  maxTime) + minTime

		console.log "+++Scroller, distance to go: #{distToGo}, time to take it: #{time}"

		params = scrollTo: {x: 0, y: target, autoKill: false}, ease: Power3.easeInOut
		if typeof cb is 'function' then params.onComplete = cb

		TweenLite.to window, time, params

		null

module.exports = Scroller
