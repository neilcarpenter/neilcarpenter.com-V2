#!/bin/bash 
#
# Requirements / assumptions:
# - ffmpeg with libvorbis, h264
# - imageOptim cli
# - input source is .mov captured on MBP using quicktime screen capture,
# with full-size browser window (this affects the cropping script)
#
# $ ./path/to/file/prepare_video.sh <source_filename> <start_time> <size>
#
# eg $ ./path/to/file/prepare_video.sh source 00:00:02.00 mobile # use "source.mov" from 2s onwards for mobile
#

function trim {
	ffmpeg -i "$1.mov" -ss $2 "$1--trim.mov"
}

function crop {
	ffmpeg -i "$1--trim.mov" -vf $CROP "$1--crop.mov"
}

function reformat {
	# ffmpeg -i "$1--crop.mov" -c:v libvpx -b:v 1M -c:a libvorbis "$1--output.webm"
	ffmpeg -i "$1--crop.mov" -vcodec h264 -acodec aac -strict -2 "$1--output.mp4"
}

function images {
	ffmpeg -i "$1--crop.mov" -f image2 -ss 00.00 -vframes 1 "$1--video-cover.jpg"
}

function optimiseImages {
	imageOptim -d .
}

function run {
	trim $1 $2
	crop $1 $CROP
	reformat $1
	images $1
	optimiseImages

	rm "$1--trim.mov"
	rm "$1--crop.mov"
}

if [ "$3" == "mobile" ]
then
	CROP="crop=672:1182:1344:328"
elif [ "$3" == "desktop" ]
then
	CROP="crop=2678:1707:342:328"
else
	CROP="crop=3168:1723:96:328"
fi	

run $1 $2 $CROP
