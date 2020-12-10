#!/bin/sh
cd ..
./ECUI/build.sh annual-sum

if [ $1 = 'prev' ]
then

scp annual-sum.tar.gz root@172.20.4.61:/home/data/html/annual-sum

rm -rf annual-sum.tar.gz
echo ' 服务器处理 '
ssh root@172.20.4.61 << eeooff
	cd /home/data/html/annual-sum
	rm -rf annual-sum/*
	mv annual-sum.tar.gz annual-sum/annual-sum.tar.gz

	cd annual-sum
	tar -zxf annual-sum.tar.gz
	rm -rf annual-sum.tar.gz
	exit 
eeooff
echo Finished: SUCCESS!

else
	if [ $1 = 'test' ]
	then

scp annual-sum.tar.gz root@192.168.15.91:/home/data/html/test

rm -rf annual-sum.tar.gz
echo ' 服务器处理 '
ssh root@192.168.15.91 << eeooff
	cd /home/data/html/test
	rm -rf annual-sum/*
	mv annual-sum.tar.gz annual-sum/annual-sum.tar.gz

	cd annual-sum
	tar -zxf annual-sum.tar.gz
	rm -rf annual-sum.tar.gz

	exit 
eeooff
echo Finished: SUCCESS!

	else

scp annual-sum.tar.gz root@172.20.4.61:/home/data/html/test

# rm -rf annual-sum.tar.gz
echo ' 服务器处理 '
ssh root@172.20.4.61 << eeooff
	cd /home/data/html/test
	rm -rf annual-sum/*
	mv annual-sum.tar.gz annual-sum/annual-sum.tar.gz

	cd annual-sum
	tar -zxf annual-sum.tar.gz
	rm -rf annual-sum.tar.gz

	exit 
eeooff
echo Finished: SUCCESS!

	fi
fi