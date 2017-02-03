class VideoAutoPlayer

	@START_DELAY : 500

	@play : ($el) =>

		videos = $el.find 'video'
		return unless videos.length

		videos = $.makeArray(videos).map (el) =>
			el     : el
			loaded : false

		VideoAutoPlayer._checkVideos videos

		null

	@_checkVideos : (videos) =>

		for video in videos
			if video.readyState is video.HAVE_ENOUGH_DATA
				video.loaded = true
			else
				$(video.el).on 'canplay', VideoAutoPlayer._checkVideos.bind(videos)

		if (videos.filter (video) => video.loaded).length is videos.length
			setTimeout =>
				videos.forEach (video) => video.el.play()
			, @START_DELAY

module.exports = VideoAutoPlayer
