
const db = require("./index.db");
const { Sequelize, DataTypes, Op } = require("sequelize");

const Platform = db.platforms;

const Status = db.status;
const ClassService = db.classService;
const EnvType = db.envType;
const LparType = db.partitionType;
const Ci = db.ci;



export async  function seed(callback) {

        // Insert Platforms initial

        await  Platform.findAll()
    .then(platform => {
        if (platform.length === 0) {

            Platform.create({
                name: "Z"
              });
        
              Platform.create({
                name: "B"
              }); 
        }
    });


        // Insert PserverType initial
        //Mainframe IBM, Appliance, Mainframe Bull, Mainframe Appliance Console, Switch

/*         await  PserverType.findAll()
    .then(pserver => {
        if (pserver.length === 0) {

            PserverType.create({
                name: "Mainframe IBM"
              });

              PserverType.create({
                name: "Appliance"
              });

              PserverType.create({
                name: "Mainframe Bull"
              });
        
              PserverType.create({
                name: "Mainframe Appliance Console"
              }); 

              PserverType.create({
                name: "Switch"
              }); 
        }
    });
 */





    // Insert Status initial

    await   Status.findAll()
    .then(status => {
        if (status.length === 0) {
          
          
             Status.create({
             name: "Available"
              });

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


        await   ClassService.findAll()
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


            await  EnvType.findAll()
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
              EnvType.create({
                name: "Production"
              });
              
        }
    });

    await  LparType.findAll()
    .then(lpar => {
        if (lpar.length === 0) {

          LparType.create({
                name: "Mainframe LGP"
              });
        
              LparType.create({
                name: "Mainframe LPAR"
              }); 
        }
    });

                // Insert StorageType initial
            //Mainframe Tape Library, Mainframe VTS, Mainframe Drive Enclosure

            await  db.hardwaresType.findAll()
            .then(hardType => {
                if (hardType.length === 0) {
        
        
                  db.hardwaresType.create({
                        name: "pserver"
                      });
                
                      db.hardwaresType.create({
                        name: "storage"
                      }); 
        
                      db.hardwaresType.create({
                        name: "netcomponent"
                      }); 
                }
            }); 


            await  db.hardwareSubtype.findAll()
            .then(hardTypeSub => {
                if (hardTypeSub.length === 0) {
        
        
                  db.hardwareSubtype.create({
                        name: "Mainframe Appliance Console"
                      });
                      db.hardwareSubtype.create({
                        name: "Switch"
                      });

                      db.hardwareSubtype.create({
                        name: "Mainframe Drive Enclosure"
                      });

                      db.hardwareSubtype.create({
                        name: "Mainframe VTS"
                      });

                      db.hardwareSubtype.create({
                        name: "Mainframe Tape Library"
                      });

                      db.hardwareSubtype.create({
                        name: "Mainframe IBM"
                      });

                      db.hardwareSubtype.create({
                        name: "Mainframe Bull"
                      });


                      
                }
            }); 


   
  };
/*    
  pserver storage netcomponent

  Mainframe Appliance Console 
  Switch
  Mainframe Drive Enclosure
  Mainframe VTS
  Mainframe Tape Library
  Mainframe IBM
 */

