class LazyImageLoader

	@ATTR : 'data-lazyimage'

	@classNames :
		LOADED : 'loaded'

	@load : ($el) =>

		$imgSrcEl = if $el.attr("#{LazyImageLoader.ATTR}") then $el else $el.find("[#{LazyImageLoader.ATTR}]")
		imgSrc    = $imgSrcEl.attr("#{LazyImageLoader.ATTR}")

		return unless imgSrc and !$imgSrcEl.data('loading')
		$imgSrcEl.data('loading', true)

		img = new Image
		img.onload = => $imgSrcEl.addClass @classNames.LOADED
		img.src = imgSrc

		null

module.exports = LazyImageLoader
