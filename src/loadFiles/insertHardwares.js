const csvtojson = require('csvtojson'); 
const db = require("../index.db");
const Provider = db.provider;
const Provider_Platform = db.provider_platform;
import { Sequelize } from "sequelize";
import moment from 'moment';
const csv = require('csv-parser');
const fs = require('fs');


const reader = require('xlsx') 
 

export async function insert(fileName,namePlatform){

    const file = reader.readFile(fileName,{cellDates: true}) 
    let data = new Array();
    const sheets = file.SheetNames 
    sheets.forEach((res) => { 
        data[res] = new Array();
     })

    for(let i = 0; i < sheets.length; i++) 
    {
       const temp = reader.utils.sheet_to_json(  file.Sheets[file.SheetNames[i]]) 
       data[sheets[i]] = (temp);

       switch (sheets[i]) {
        
        case 'pserver|Mainframe Bull':
           await insertpserver(temp,namePlatform);
          break;

           case 'pserver|Appliance':
            await insertpserver(temp,namePlatform);
          break; 

          case 'pserver|Mainframe IBM':
            await insertpserver(temp,namePlatform);
          break; 

          case 'storage|M. Drive Enclosure':
            
            await insertpserver(temp,namePlatform);
          break;

          case 'storage|Mainframe VTS & TL':
            await insertpserver(temp,namePlatform);
          break;

          case 'storage|Mainframe VTS':
            await insertpserver(temp,namePlatform);
          break;
      }

    } 
}


async function  insertpserver(pservers,namePlatform){

    for (var i = 1; i < pservers.length; i++) { 
        
         const ciPserver = {

            our_name : pservers[i]["__EMPTY"],
            type : pservers[i]["TYPE"],
            subtype : pservers[i]["SUBTYPE"],
            disblay_name : pservers[i]["DISPLAY_NAME"],
            company : pservers[i]["COMPANY"],
            nrb_managed_by : pservers[i]["NRB_MANAGED_BY"], 
            assignment : pservers[i]["ASSIGNMENT"],
            nrb_class_service : pservers[i]["NRB_CLASS_SERVICE"],
            status : pservers[i]["ISTATUS"],
            description : pservers[i]["DESCRIPTION"],
            serial_no : pservers[i]["SERIAL_NO"],
            
          };

          if(ciPserver.serial_no !==undefined){

            ciPserver.nrb_env_type = (pservers[i]["NRB_ENV_TYPE"]).substring((pservers[i]["NRB_ENV_TYPE"]).lastIndexOf(".")+1).trim();

        
          const asyncFunction = async () => {
            let step1 = await db.status.findOne({where: {name: ciPserver.status} , attributes: ['status_id']});
            ciPserver.status_id = step1.dataValues.status_id;
           

            step1 = await db.platforms.findOne({where: {name: namePlatform} , attributes: ['platform_id']})
            ciPserver.platform_id = step1.dataValues.platform_id;

            step1 = await db.classService.findOne({where: {name: ciPserver.nrb_class_service} , attributes: ['class_service_id']})
            ciPserver.class_service_id = step1.dataValues.class_service_id;

            step1 = await db.envType.findOne({where: {name:ciPserver.nrb_env_type} , attributes: ['env_type_id']})
            ciPserver.env_type_id = step1.dataValues.env_type_id;

            step1 = await db.hardwaresType.findOne({where: {name:ciPserver.type} , attributes: ['hardware_type_id']})
            ciPserver.hardware_type_id = step1.dataValues.hardware_type_id;

            step1 = await db.hardwareSubtype.findOne({where: {name:ciPserver.subtype} , attributes: ['subtype_hardware_id']})
            ciPserver.subtype_hardware_id = step1.dataValues.subtype_hardware_id;

            return ciPserver;



          }



          await asyncFunction().then(app=>{

              db.ci.create({
                name: app.our_name,
                company:app.company,
                nrb_managed_by:app.nrb_managed_by,
                description:app.description,
                platform_id:app.platform_id,
                status_id:app.status_id,
                class_service_id : app.class_service_id
              }).then(function(res){

                    db.hardwares.create({
                        serial_no: app.serial_no,
                        env_type_id:app.env_type_id, 
                        hardware_type_id:app.hardware_type_id,
                        subtype_hardware_id:app.subtype_hardware_id,
                        ci_id:res.dataValues.ci_id
                           
                          });


              }); 
 
 

          }); 

        }
 
}


}

async function insertStorage(pservers,namePlatform){

    for (var i = 1; i < pservers.length; i++) { 
        
         const ciPserver = {

             our_name : pservers[i]["__EMPTY"],
            type : pservers[i]["TYPE"],
            subtype : pservers[i]["SUBTYPE"],
            disblay_name : pservers[i]["DISPLAY_NAME"],
            company : pservers[i]["COMPANY"],
            nrb_managed_by : pservers[i]["NRB_MANAGED_BY"], 
            assignment : pservers[i]["ASSIGNMENT"],
            nrb_class_service : pservers[i]["NRB_CLASS_SERVICE"],
            status : pservers[i]["ISTATUS"],
            description : pservers[i]["DESCRIPTION"],
            serial_no : pservers[i]["SERIAL_NO"],
            
          };

          if(ciPserver.serial_no !==undefined){

            ciPserver.nrb_env_type = (pservers[i]["NRB_ENV_TYPE"]).substring((pservers[i]["NRB_ENV_TYPE"]).lastIndexOf(".")+1).trim();

        
          const asyncFunction = async () => {
            let step1 = await db.status.findOne({where: {name: ciPserver.status} , attributes: ['status_id']});
            ciPserver.status_id = step1.dataValues.status_id;
           

            step1 = await db.platforms.findOne({where: {name: namePlatform} , attributes: ['platform_id']})
            ciPserver.platform_id = step1.dataValues.platform_id;

            step1 = await db.classService.findOne({where: {name: ciPserver.nrb_class_service} , attributes: ['class_service_id']})
            ciPserver.class_service_id = step1.dataValues.class_service_id;

            step1 = await db.storageType.findOne({where: {name:ciPserver.subtype} , attributes: ['storage_type_id']})
            ciPserver.storage_type_id = step1.dataValues.storage_type_id;

            step1 = await db.envType.findOne({where: {name:ciPserver.nrb_env_type} , attributes: ['env_type_id']})
            ciPserver.env_type_id = step1.dataValues.env_type_id;

            return ciPserver;



          }



          await asyncFunction().then(app=>{

              db.ci.create({
                name: app.our_name,
                company:app.company,
                nrb_managed_by:app.nrb_managed_by,
                description:app.description,
                platform_id:app.platform_id,
                status_id:app.status_id,
                class_service_id : app.class_service_id
              }).then(function(res){

                    db.storages.create({
                        serial_no: app.serial_no,
                        env_type_id:app.env_type_id, 
                        storage_type_id:app.storage_type_id,
                        ci_id:res.dataValues.ci_id
                           
                          });


              }); 
 
 

          }); 

        }
 
}


}


export async function insertRelation(fileName,namePlatform){
    extractData(fileName).then(data=>{
    
    Object.keys(data).forEach(async function(key, index) {
      let step1;
      let pserver_ids=[];

     const asyncFunction = async () => {

      let elementToInsert;

      
       step1 = await db.storages.findOne( { include: {   model: db.ci,  as: 'ci',    where: {    name:key } }  }) 
      
      if(step1 ===null){
         step1 = await db.pservers.findOne( { include: {   model: db.ci,  as: 'ci',    where: {    name:key } }  }) 
      }

      const forLoop = async () => {
        for (let index = 0; index < data[key].length; index++) {

          console.log('=> ' ,data[key][index])
           if(data[key][index] != 'CEC02B' || data[key][index] != 'CEC03B'  ){
          let setp2 = await db.pservers.findOne( { include: {   model: db.ci,  as: 'ci',    where: {    name:data[key][index].replace(/\s/g,"") } }  });
           pserver_ids.push(setp2.dataValues.pserver_id)
          } 
        }
        
      }
    
      await forLoop();

       
      

      return elementToInsert;

    } 

    try {

      await asyncFunction().then(elementToInsert=>{
        if(step1 !== null && step1.dataValues.storage_id !== null &&step1.dataValues.storage_id ){
          console.log(step1.dataValues.storage_id);
          
          console.log(pserver_ids);

        }else{
          console.log(step1.dataValues.pserver_id);
  
        }
      });
      
    } catch (error) {
      console.log(error)
    }




  });


 });
}


 function extractData(fileName) {
  return new Promise(function(resolve, reject)
{
  const results = [];
  let firstColone = [];
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end',  async () => {

      let key =  Object.keys(results[0])[0];
      let val = key.substring(key.indexOf(';') + 1);
      let firstLine = val.split(';');
      var i, j;
      for (i = 0; i < results.length; i++) {
        let line = results[i][key];
        if (line !== undefined) {
          let key = line.substring(0, line.indexOf(';'));

          firstColone[key] = line.substring(line.indexOf(';') + 1).split(';');

          for (j = 0; j < firstColone[key].length; j++) {
            if (firstColone[key][j] === 'X') {
              firstColone[key][j] = firstLine[j];
            }
          }

          firstColone[key] =  firstColone[key].filter(item => !(item.replace(/\s/g,"") === ''));

        }

      }

        resolve(firstColone);

    });

});

}