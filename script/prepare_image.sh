#!/bin/bash 
#
# Requirements / assumptions:
# - imagemagick
# - imageOptim cli
# - input source is captured on MBP at +1 from default resolution
# with full-size browser window (this affects the cropping script)
#
# $ ./path/to/file/prepare_image.sh <source_filename> <size>
#
# eg $ ./path/to/file/prepare_image.sh my-image mobile
#

function crop {
	convert $1 -crop $CROP "$1--crop.png"
}

function optimiseImages {
	imageOptim -d .
}

function run {
	crop $1 $CROP
	# optimiseImages
}

if [ "$2" == "mobile" ]
then
	CROP="670x1182+1344+328"
elif [ "$2" == "desktop" ]
then
	CROP="2678x1707+342+328"
else
	CROP="2880x1566+240+328"
fi

IFS=,
ary=($1)
for key in "${!ary[@]}"
do
	echo "cropping ${ary[$key]}"
	run "${ary[$key]}.$2.png" $CROP
done

# for name in "what" "up"
# do
# 	echo ${name}
# 	# run name $CROP
# done
