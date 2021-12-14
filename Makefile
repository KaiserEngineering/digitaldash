BLUE='\033[0;34m'
NC='\033[0m' # No Color

install:
	echo -e "${BLUE}Installing Python requirements..${NC}";
	python3 -m pip install -r requirements.txt;
	echo -e "${BLUE}Installing Nodejs requirements..${NC}";
	cd frontend npm install; cd ..;
	echo -e "${BLUE}All done..${NC}";
.PHONY: install

build:
	cd frontend; npm run build
	@python3 themes/loadThemes.py
.PHONY: build

start_python:
	@python3 main.py
.PHONY: start_python

start_webapp:
	cd frontend; npm run dev
.PHONY: start_webapp

run:
	make -j 2 start_python start_webapp
.PHONY: run

test:
	@python3 -m pytest tests
	cd libdigitaldash/;cargo test;
.PHONY: test

lint:
	@echo "\n${BLUE}Running Pylint against source and test files...${NC}\n"
	@pylint --rcfile=setup.cfg **/*.py
	@echo "\n${BLUE}Running Bandit against source files...${NC}\n"
	@bandit -r --ini setup.cfg

clean:
	rm -rf .pytest_cache .coverage .pytest_cache coverage.xml

.PHONY: clean test
