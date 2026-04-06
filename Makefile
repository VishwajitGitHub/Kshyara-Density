.PHONY: install link dev start

install:
	npm install

link:
	npm link
	@echo "KSHYARA CLI is now linked globally! Type 'kshyara' to start."

dev:
	npm run dev

start:
	npm start
