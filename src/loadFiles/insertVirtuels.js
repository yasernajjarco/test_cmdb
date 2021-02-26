const csvtojson = require('csvtojson'); 
const db = require("../index.db");
const Provider = db.provider;
const Provider_Platform = db.provider_platform;
import { Sequelize } from "sequelize";
import moment from 'moment';



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
        
        case 'lserver|Mainframe LPAR':
           await insertlserver(temp,namePlatform,'Mainframe LPAR');
          break;

           case 'lserver|Mainframe LGP':
            await insertlserver(temp,namePlatform,'Mainframe LGP');
          break; 

          case 'lserver|zVM Linux':
           await  insertzLinux(temp,namePlatform);
          break; 
      }

    } 
}


function insertlserver(lserver,namePlatform,nameType){

    for (var i = 1; i < lserver.length; i++) { 
        
         const ciLserver = {
          logicalName : lserver[i]["LOGICAL_NAME"],

          host_ci : lserver[i]["__EMPTY"],
          host_type : lserver[i]["__EMPTY_1"],
          system_ci : lserver[i]["__EMPTY_2"],
          system_ci_subtype : lserver[i]["__EMPTY_3"],
          


            type : lserver[i]["TYPE"],
            subtype : lserver[i]["SUBTYPE"],
            disblay_name : lserver[i]["DISPLAY_NAME"],
            company : lserver[i]["COMPANY"],
            nrb_managed_by : lserver[i]["NRB_MANAGED_BY"], 
            assignment : lserver[i]["ASSIGNMENT"],
            nrb_class_service : lserver[i]["NRB_CLASS_SERVICE"],
            nrb_env_type : (lserver[i]["NRB_ENV_TYPE"]).substring((lserver[i]["NRB_ENV_TYPE"]).lastIndexOf(".")+1).trim(),
            status : lserver[i]["ISTATUS"],
            description : lserver[i]["DESCRIPTION"],

            unit : lserver[i]["Unit"]            
          };



        
           const asyncFunction = async () => {
             let step1 = await db.status.findOne({where: {name: ciLserver.status} , attributes: ['status_id']});
            ciLserver.status_id = step1.dataValues.status_id;
           

             step1 = await db.platforms.findOne({where: {name: namePlatform} , attributes: ['platform_id']})
             ciLserver.platform_id = step1.dataValues.platform_id;

            step1 = await db.classService.findOne({where: {name: ciLserver.nrb_class_service} , attributes: ['class_service_id']})
            ciLserver.class_service_id = step1.dataValues.class_service_id;

            step1 = await db.envType.findOne({where: {name:ciLserver.nrb_env_type} , attributes: ['env_type_id']})
            ciLserver.env_type_id = step1.dataValues.env_type_id; 
 

             step1 = await db.hardwares.findOne( { include: {   model: db.ci,  as: 'ci',    where: {name:ciLserver.host_ci  } }  }) 
            ciLserver.hardware_id = step1.dataValues.hardware_id; 

            step1 = await db.partitionType.findOne({where: {name:nameType} , attributes: ['partition_type_id']})
            ciLserver.partition_type_id = step1.dataValues.partition_type_id; 


            return ciLserver;


           }
 


            asyncFunction().then(lserver=>{
 
               db.ci.create({
                name: lserver.logicalName,
                company:lserver.company,
                nrb_managed_by:lserver.nrb_managed_by,
                description:lserver.description,
                platform_id:lserver.platform_id,
                status_id:lserver.status_id,
                class_service_id : lserver.class_service_id
              }).then(function(res){

                    db.lpars.create({
                    //  hardware_id: lserver.hardware_id,
                        env_type_id:lserver.env_type_id, 
                        host_ci:lserver.host_ci,
                        host_type:lserver.host_type,
                        ci_id:res.dataValues.ci_id,
                        partition_type_id : lserver.partition_type_id
                           
                          }).then(function(res){
                            db.hardware_lpar.create({
                              hardware_id: lserver.hardware_id,
                              lpar_id:res.dataValues.lpar_id,
                                  }); 
                            }); ;

              })


              
 
 

          });  
 
}


}


function insertzLinux(lserver,namePlatform){

  for (var i = 1; i < lserver.length; i++) { 
      
       const ciLserver = {

        ourname : lserver[i]["__EMPTY"],
        supervisuer : lserver[i]["__EMPTY_1"],
       
        

          type : lserver[i]["TYPE"],
          subtype : lserver[i]["SUBTYPE"],
          logicalName : lserver[i]["LOGICAL_NAME"],
          disblay_name : lserver[i]["DISPLAY_NAME"],
          company : lserver[i]["COMPANY"],
          nrb_managed_by : lserver[i]["NRB_MANAGED_BY"], 
          assignment : lserver[i]["ASSIGNMENT"],
          nrb_class_service : lserver[i]["NRB_CLASS_SERVICE"],
          nrb_env_type : (lserver[i]["NRB_ENV_TYPE"]).substring((lserver[i]["NRB_ENV_TYPE"]).lastIndexOf(".")+1).trim(),
          status : lserver[i]["ISTATUS"],
          description : lserver[i]["DESCRIPTION"],

          domaine : lserver[i]["DOMAIN"],
          os_version : lserver[i]["OS_VERSION"],
          cpu_type : lserver[i]["CPU_TYPE"],
          cpu_number : lserver[i]["CPU_NUMBER"],
          physical_mem_total : lserver[i]["PHYSICAL_MEM_TOTAL"],
          console_name : lserver[i]["CONSOLE_NAME"],

        };


       // console.log(ciLserver)

      
     /*     const asyncFunction = async () => {
           let step1 = await db.status.findOne({where: {name: ciLserver.status} , attributes: ['status_id']});
          ciLserver.status_id = step1.dataValues.status_id;
         

           step1 = await db.platforms.findOne({where: {name: namePlatform} , attributes: ['platform_id']})
           ciLserver.platform_id = step1.dataValues.platform_id;

          step1 = await db.classService.findOne({where: {name: ciLserver.nrb_class_service} , attributes: ['class_service_id']})
          ciLserver.class_service_id = step1.dataValues.class_service_id;

          step1 = await db.envType.findOne({where: {name:ciLserver.nrb_env_type} , attributes: ['env_type_id']})
          ciLserver.env_type_id = step1.dataValues.env_type_id; 


           step1 = await db.pservers.findOne( { include: {   model: db.ci,  as: 'ci',    where: {    name:ciLserver.host_ci  } }  }) 
          ciLserver.pserver_id = step1.dataValues.pserver_id; 


          return ciLserver;


         }
 */


/*           asyncFunction().then(lserver=>{

            console.log(lserver.pserver_id)
             db.ci.create({
              name: lserver.logicalName,
              company:lserver.company,
              nrb_managed_by:lserver.nrb_managed_by,
              description:lserver.description,
              platform_id:lserver.platform_id,
              status_id:lserver.status_id,
              class_service_id : lserver.class_service_id
            }).then(function(res){

                  db.lpars.create({
                     pserver_id: lserver.pserver_id,
                      env_type_id:lserver.env_type_id, 
                      host_ci:lserver.host_ci,
                      host_type:lserver.host_type,
                      ci_id:res.dataValues.ci_id
                         
                        });


            });  



        }); */  

}


}