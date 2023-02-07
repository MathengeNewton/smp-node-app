check-version:
	@node tools/checkversion

run-seed:
	@node tools/generate-user

versioncheck: check-version
	npm run test-version

initialseeds: run-seed
	prisma db seed

mytarget: script.sh
	cp -f myfile.sh mytarget