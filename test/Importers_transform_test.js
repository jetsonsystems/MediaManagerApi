'use strict';

var
  should  = require('should')
  ,expect = require('chai').expect
  ,fs     = require('fs')
  ,ImportBatch = require('ImageService/lib/plm-image/ImportBatch')
  ,Importers = require('../lib/MediaManagerApiCore').Importers
  ,util   = require('util')
;


describe('Importers', function () {

  var 
    URL_VERSION = '/v0'
    ,NAME = 'importers'
    ,INST_NAME = 'importer'
    ,PATH = '/' + NAME
    ,importers   = new Importers(PATH, {instName: INST_NAME, pathPrefix: URL_VERSION})
  ;

  var
    IMPORT_DIR = '/some/image/dir'
    ,OID  = 'xxx-yyy-zzz'
    ,IMAGES_TO_IMPORT = [ IMPORT_DIR + '/image1.jpg', IMPORT_DIR + '/image2.jpg']
    ,batchImport = new ImportBatch({path: IMPORT_DIR, oid: OID, images_to_import: IMAGES_TO_IMPORT})
  ;

  it("should have proper values at initialization", function ()
  {
    // console.log(util.inspect(images,true));
    importers.name.should.equal(NAME);
    importers.path.should.equal(PATH);
    importers.instName.should.equal(INST_NAME);
    importers.pathPrefix.should.equal(URL_VERSION);
    should.not.exist(importers.subResource);
  });


  it("should transform a batchImport via Importers.transformRep", function () 
  {
    var rep = importers.transformRep(batchImport, {isInstRef: true});
    // console.log("batch: %s", util.inspect(batchImport));
    // console.log("rep: %s", util.inspect(rep));
    rep.id.should.equal('$' + batchImport.oid);
    rep.created_at.should.equal(batchImport.created_at);
    rep.started_at.should.equal(batchImport.getStartedAt());
    // rep.completed_at.should.equal(batchImport.ended_at);
    rep.num_to_import.should.equal(batchImport.getNumToImport());
    rep.num_imported.should.equal(batchImport.getNumImported());
    rep.num_success.should.equal(batchImport.getNumSuccess());
    rep.num_error.should.equal(batchImport.getNumError());
  });
});