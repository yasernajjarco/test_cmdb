const db = require("./index.db");
const { Sequelize, DataTypes, Op } = require("sequelize");

const Platform = db.platforms;
const Status = db.status;
const ClassService = db.classService;
const EnvType = db.envType;
const PserverType = db.pserverType;
const StorageType = db.storageType;
const Ci = db.ci;
const Provider = db.provider;
const Application = db.application;




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

    Ci.findAll()
    .then(ci => {
        if (ci.length === 0) {


          Ci.create({
                name: "Drive",
                logical_name:"test", 
                company:"test",
                nrb_managed_by:"test",
                description:"test dec",
                class_service_id:1,
                platform_id:1,
                status_id:1
              });
        
            
        }
    });

    Provider.findAll()
    .then(pro => {
        if (pro.length === 0) {

          Provider.create({
                name: "IBM",
                address:"rue de la cité", 
                vendor_code:"IBM001",
                vendor:"IMB Company",
               
              });
        
            
        }
    });


    Application.findAll()
    .then(app => {
        if (app.length === 0) {

          Application.create({
            itservice: "IT serv",
            product_code:"SSO009ID", 
            version:"1.1",
            is_valid:1,
            end_of_support_date:Sequelize.fn('NOW'),
            end_extended_support:Sequelize.fn('NOW'),
            provider_id:1,
            ci_id:2
               
              });
        
            
        }
    });


   
  };
   
