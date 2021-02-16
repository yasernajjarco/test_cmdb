const db = require("./index");
const Platform = db.platforms;
const Status = db.status;
const ClassService = db.classService;
const EnvType = db.envType;
const PserverType = db.pserverType;
const StorageType = db.storageType;


exports.seed = () => {


        // Insert Platforms initial

    Platform.findAll()
    .then(platform => {
        if (platform.length === 0) {

            Platform.create({
                name: "Z"
              });
        
              Platform.create({
                name: "Bull"
              }); 
        }
    });


        // Insert PserverType initial

    PserverType.findAll()
    .then(pserver => {
        if (pserver.length === 0) {

            PserverType.create({
                name: "Appliance SKLM"
              });
        
              PserverType.create({
                name: "Console SE"
              }); 
        }
    });


            // Insert StorageType initial

    StorageType.findAll()
    .then(storage => {
        if (storage.length === 0) {


            StorageType.create({
                name: "Drive"
              });
        
              StorageType.create({
                name: "VTS"
              }); 

              StorageType.create({
                name: "Tape Libray"
              }); 
        }
    });



    // Insert Status initial

    Status.findAll()
    .then(status => {
        if (status.length === 0) {
            
            Status.create({
                name: "Operational"
              });
            
              Status.create({
                name: "Retired"
              });
              Status.create({
                name: "Under construction"
              });
              Status.create({
                name: "Pre-Operation"
              });
              Status.create({
                name: "Pre-retired"
              });
          
        }
    });

        // Insert ClassService initial


    ClassService.findAll()
    .then(classServ => {
        if (classServ.length === 0) {

            ClassService.create({
                name: "SAAS"
              });
        
              ClassService.create({
                name: "PAAS"
              }); 
              ClassService.create({
                name: "IAAS"
              });
              ClassService.create({
                name: "Housing"
              });
              ClassService.create({
                name: "Not applicable"
              });
        }
    });

            // Insert EnvType initial


    EnvType.findAll()
    .then(env_type => {
        if (env_type.length === 0) {

            EnvType.create({
                name: "Laboratoire"
              });
              EnvType.create({
                name: "Développement"
              }); 
              EnvType.create({
                name: "Homologation"
              });
              EnvType.create({
                name: "Acceptance"
              });
              EnvType.create({
                name: "Not Production"
              });
              EnvType.create({
                name: "Unknown"
              });
        }
    });

   
  };
   
