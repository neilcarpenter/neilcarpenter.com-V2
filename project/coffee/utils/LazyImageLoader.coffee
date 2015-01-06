class LazyImageLoader

	@ATTR : 'data-lazyimage'

	@classNames :
		LOADED : 'loaded'

	@load : ($el) =>

		$imgSrcEl = if $el.attr("#{LazyImageLoader.ATTR}") then $el else $el.find("[#{LazyImageLoader.ATTR}]")
		_imgSrc   = $imgSrcEl.attr("#{LazyImageLoader.ATTR}")
		imgSrc    = if _imgSrc then @supplantString _imgSrc, @getVars() else null

		return unless _imgSrc and !$imgSrcEl.data('loading')
		$imgSrcEl.data('loading', true)

		img = new Image
		img.onload = =>
			$imgSrcEl
				.find('.bg-image')
					.css('background-image', "url(#{imgSrc})")
					.end()
				.addClass @classNames.LOADED
		img.src = imgSrc

		null

	@getVars : =>

		vars =
			BASE_URL : @NC().BASE_URL
			RWD_SIZE : @NC().appView.dims.r

		vars

	@supplantString : (str, vals) ->

		return str.replace /{{ ([^{}]*) }}/g, (a, b) ->
			r = vals[b]
			(if typeof r is "string" or typeof r is "number" then r else a)

	@NC : =>

		return window.NC

module.exports = LazyImageLoader
