class WordTransitioner

	@classNames :
		WORD     : 'wo'
		ANIM_IN  : 'a'
		ANIM_OUT : 'ao'

	@ANIM_DELAY    : 500
	@ANIM_DURATION : 1000

	@in : ($el, cb) =>

		@animate 'in', $el, cb		

		null

	@out : ($el, cb) =>

		@animate 'out', $el, cb

		null

	@animate : (direction, $el, cb) =>

		className = @classNames[(if direction is 'in' then 'ANIM_IN' else 'ANIM_OUT')]

		$words = $el.find '.'+@classNames.WORD
		len    = $words.length

		$words.each (i, el) =>
			do (i, el, $words) =>
				delay = (i*@ANIM_DELAY)
				setTimeout =>
					$(el).addClass className
					if i is len-1
						setTimeout =>
							cb?()
							if direction is 'out' then @reset $words
						, @ANIM_DURATION
				, delay

		null

	@reset : ($el) =>

		$el.removeClass @classNames.ANIM_IN + ' ' + @classNames.ANIM_OUT

		null

module.exports = WordTransitioner
