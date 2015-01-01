class WordTransitioner

	@classNames :
		word    : 'wo'
		animIn  : 'a'
		animOut : 'ao'

	@delay : 500

	@ANIM_DURATION : 1000

	@in : ($el, cb) =>

		@animate 'in', $el, cb		

		null

	@out : ($el, cb) =>

		@animate 'out', $el, cb

		null

	@animate : (direction, $el, cb) =>

		className = @classNames[(if direction is 'in' then 'animIn' else 'animOut')]

		$words = $el.find '.'+@classNames.word
		len    = $words.length

		$words.each (i, el) =>
			do (i, el, $words) =>
				delay = (i*@delay)
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

		$el.removeClass @classNames.animIn + ' ' + @classNames.animOut

		null

module.exports = WordTransitioner
