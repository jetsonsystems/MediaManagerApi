
# TESTS = $(shell find test -name "*_test.js")
#
# The following tests are disasbled:
#
#  test/StorageSynchronizers_test.js: There are configuration issues using touchdb + a remote couchdb.
#  test/Importers_test.js: Stand alone this test works. From the harness, there are mulitple imports which send notifications messing up the
#    notificaiton testing which happens here.
#
TESTS = \
  test/Images_transform_test.js \
  test/ImportersImages_transform_test.js \
  test/Importers_transform_test.js \
  test/mediaManagerApiCoreTrash_test.js \
  test/mediaManagerApiCore_ImportBatch_test.js \
  test/mediaManagerApiCore_test.js

test:
	@./node_modules/.bin/mocha $(TESTS) -u bdd --reporter list --timeout 600000s --recursive
.PHONY: test
