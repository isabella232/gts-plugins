#!/bin/bash

SOURCE=$(cd `dirname $0`; pwd)

# target location
TARGET=$1

if [ x$TARGET = x ]; then

	cat <<EOF
Must supply target folder parameter, e.g.:

  deploy.sh ../deploy/lib/gts-plugins
EOF
else
	#echo "	Source: $SOURCE";
	#echo "	Target: $TARGET";

	for i in $(find $SOURCE -type d)
	do
		if [[ "$i" == */assets ]]
		then
			f=${i//$SOURCE}
			echo "	Copying assets: $f";
			mkdir -p $TARGET/$f/
			cp -r $SOURCE/$f/*.* $TARGET/$f/
		fi
	done

	cp -r $SOURCE/*.md $TARGET
fi
