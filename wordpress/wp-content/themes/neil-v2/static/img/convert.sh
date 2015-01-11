# LRG -> 1980
# MED -> ~1440
# SML -> ~650

for file in */*/*.png
do
	echo ${file}
	convert ${file} -resize 73% -quality 100 ${file//_LRG/_MED}
	convert ${file} -resize 34% -quality 100 ${file//_LRG/_SML}
done