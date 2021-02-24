BLUE='\033[0;34m'
NC='\033[0m' # No Color

run:
	@python3 main.py

test:
	@python3 -m pytest tests

lint:
	@echo "\n${BLUE}Running Pylint against source and test files...${NC}\n"
	@pylint --rcfile=setup.cfg **/*.py
	@echo "\n${BLUE}Running Bandit against source files...${NC}\n"
	@bandit -r --ini setup.cfg

clean:
	rm -rf .pytest_cache .coverage .pytest_cache coverage.xml

.PHONY: clean test
