.PHONY: all
all: npm-install build

.PHONY: build
build: build-examples
	npm run build

.PHONY: build-examples
build-examples: build-example-express build-example-react-app

.PHONY: build-example-express
build-example-express:

.PHONY: build-example-react-app
build-example-react-app:

.PHONY: npm-install
npm-install:
	npm ci
	cd examples/express
	npm ci
	cd ../..
	cd examples/react-app
	npm ci