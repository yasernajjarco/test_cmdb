import { hardwareSubtype } from "./index.db";

const db = require("./index.db");
const { Sequelize, DataTypes, Op } = require("sequelize");

const Platform = db.platforms;
const Status = db.status;
const ClassService = db.classService;
const EnvType = db.envType;
const LparType = db.partitionType;


const platforms = [{name:'Z'}, {name:'B'}];
const status = [{name:'Available'}, {name:'Operational'}, {name:'Retired'}, {name:'Under construction'}, {name:'Pre-Operation'}, {name:'Pre-retired'}];
const classServices = [ {name:'SAAS'}, {name:'PAAS'}, {name:'IAAS'}, {name:'Housing'}, {name:'Not applicable'}];
const envTypes = [ {name:'Laboratoire'}, {name:'Développement'}, {name:'Homologation'}, {name:'Acceptance'}, {name:'Not Production'}, {name:'Unknown'}, {name:'Production'}];
const hardTypeSubs = [ {name:'Mainframe Appliance Console'}, {name:'Switch'},{name:'Mainframe Drive Enclosure'},{name:'Mainframe VTS'},{name:'Mainframe IBM'},{name:'Mainframe Tape Library'},{name:'Mainframe Bull'}];
const lparTypes = [ {name:'Mainframe LGP'}, {name:'Mainframe LPAR'}];
const hardwaresTypes = [ {name:'pserver'}, {name:'storage'},{name:'netcomponent'}];



export async  function seed() {

        // Insert Platforms initial
       
        await Promise.all(platforms.map(async (item) => {
          await Platform.findOrCreate({
            where: {
               name: item.name 
              },
            default: { 
              name:item.name
             }
        })
        }));
    
    // Insert Status initial

        await Promise.all(status.map(async (item) => {
          await Status.findOrCreate({
            where: {
               name: item.name 
              },
            default: { 
              name:item.name
             }
        })
        }));

        // Insert ClassService initial
        await Promise.all(classServices.map(async (item) => {
          await ClassService.findOrCreate({
            where: {
               name: item.name 
              },
            default: { 
              name:item.name
             }
        })
        }));


            // Insert EnvType initial


            await Promise.all(envTypes.map(async (item) => {
              await EnvType.findOrCreate({
                where: {
                   name: item.name 
                  },
                default: { 
                  name:item.name
                 }
            })
            }));


              // Insert lparType initial


              await Promise.all(lparTypes.map(async (item) => {
                await LparType.findOrCreate({
                  where: {
                     name: item.name 
                    },
                  default: { 
                    name:item.name
                   }
              })
              }));



                // Insert hardwaresType initial

            await Promise.all(hardwaresTypes.map(async (item) => {
                await db.hardwaresType.findOrCreate({
                  where: {
                     name: item.name 
                    },
                  default: { 
                    name:item.name
                   }
              })
              }));

              // Insert hardwaresType initial

            await Promise.all(hardTypeSubs.map(async (item) => {
              await db.hardwareSubtype.findOrCreate({
                where: {
                   name: item.name 
                  },
                default: { 
                  name:item.name
                 }
            })
            }));

   
  };
  

