list:
	@echo "build"
	@echo "pre-build"

pre-build:
	npm install -g nodemon @babel/core @babel/node tramp-cli

build: install

install:
	git pull
	npm install
	npm run build

migrate:
	tramp migrate

travis-build-log:
	printenv
	echo "Branch: ${TRAVIS_BRANCH}\nCommit: ${TRAVIS_COMMIT}\nBuild Number:${TRAVIS_BUILD_NUMBER} \nTime: "`TZ=Asia/Shanghai date "+%Y-%m-%d %H:%M:%S"` > ./static/ci.txt
	cat ./static/ci.txt
