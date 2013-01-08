'use strict';

var
  should  = require('should')
  ,config = require('./config')
  ,expect = require('chai').expect
  ,fs     = require('fs')
  ,ImportBatch = require('ImageService/lib/plm-image/ImportBatch')
  ,Image       = require('ImageService/lib/plm-image/Image')
  ,Images      = require('../lib/MediaManagerApiCore')(config).Images
  ,Importers   = require('../lib/MediaManagerApiCore')(config).Importers
  ,ImportersImages = require('../lib/MediaManagerApiCore')(config).ImportersImages
  ,util   = require('util')
;


describe('Importers', function () {

  var 
    URL_VERSION = '/v0'
    ,NAME = 'importers'
    ,PATH = '/' + NAME
    ,INST_NAME = 'importer'
    ,IMG_SUB_RC = 'images'
    ,IMG_INST_NAME = 'image'
    ,resource   = new ImportersImages(null, {
      pathPrefix: URL_VERSION
      ,subResource: new Importers(PATH, {
        instName: INST_NAME 
        ,subResource: new Images('/' + IMG_SUB_RC, {instName: IMG_INST_NAME})
      })
    })
  ;

  it("should have proper values at initialization", function ()
  {
    // console.log(util.inspect(resource,true));
    resource.pathPrefix.should.equal(URL_VERSION);
    should.not.exist(resource.path);
    resource.name.should.equal('');
    resource.instName.should.equal('');

    var sub1 = resource.subResource;
    sub1.pathPrefix.should.equal('');
    sub1.path.should.equal(PATH);
    sub1.name.should.equal(NAME);
    sub1.instName.should.equal(INST_NAME);

    var sub2 = sub1.subResource;
    sub2.pathPrefix.should.equal('');
    sub2.path.should.equal('/' + IMG_SUB_RC);
    sub2.name.should.equal(IMG_SUB_RC);
    sub2.instName.should.equal(IMG_INST_NAME);
    should.not.exist(sub2.subResource);
  });

  var
    TEST_DIR = './test/resources/json'
    ,IMPORT_DIR = '/some/image/dir'
    ,OID  = 'xxx-yyy-zzz'
    ,batchImport = new ImportBatch({path: IMPORT_DIR, oid: OID})
    ,img1 = new Image({path: IMPORT_DIR + '/img1.jpg', oid: OID + '-1', batch_id: OID})
    ,img2 = new Image({path: IMPORT_DIR + '/img2.png', oid: OID + '-2', batch_id: OID})
  ;

  img1.readFromGraphicsMagick(JSON.parse(fs.readFileSync(TEST_DIR + '/gm_jpg_metadata.json')));
  img2.readFromGraphicsMagick(JSON.parse(fs.readFileSync(TEST_DIR + '/gm_png_metadata.json')));

  batchImport.images.push(img1);
  batchImport.images.push(img2);

  batchImport.num_to_import = 0; // the batch completed, so there is nothing to import
  batchImport.num_imported  = 3; 
  batchImport.num_success   = 2;
  batchImport.num_error     = 1;

  // batchImport.setEndedAt(new Date(batchImport.getStartedAt().UTC() + 1000));
  batchImport.status = 'COMPLETED';

  it("should transform a batchImport with images via ImportersImages.transformRep", function () 
  {
    var rep = resource.transformRep(batchImport);
    // console.log("batch: %s", util.inspect(batchImport));
    // console.log("rep: %s", util.inspect(rep));
    rep.id.should.equal('$' + batchImport.oid);
    rep.created_at.should.equal(batchImport.created_at);
    rep.started_at.should.equal(batchImport.getStartedAt());
    // rep.completed_at.should.equal(batchImport.ended_at);
    rep.num_to_import.should.equal(batchImport.getNumToImport());
    rep.num_imported.should.equal(batchImport.getNumAttempted());
    rep.num_success.should.equal(batchImport.getNumSuccess());
    rep.num_error.should.equal(batchImport.getNumError());
    console.log("done with assertions");
  });

});
