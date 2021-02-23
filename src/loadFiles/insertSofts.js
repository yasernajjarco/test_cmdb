const csvtojson = require('csvtojson'); 
const db = require("../index.db");
const Provider = db.provider;
const Provider_Platform = db.provider_platform;
import { Sequelize } from "sequelize";
import moment from 'moment';



const reader = require('xlsx') 
 

export function insertApplication(fileName,namePlatform){

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
        case 'application|Mainframe Software':
         //   console.log(temp);
         insertApplications(temp,namePlatform);
          break;

         /*  case 'Soft':
         insertSofts(temp);
          break; */
      }

    } 

     

}


function insertApplications(apps,namePlatform){

    for (var i = 1; i < apps.length; i++) { 
        
         const app = {
            vendor_code : apps[i]["__EMPTY_1"],
            product_code : apps[i]["__EMPTY_2"],
            version : apps[i]["VERSION"],
            type : apps[i]["TYPE"],
            subtype : apps[i]["SUBTYPE"], 
            logicalname : apps[i]["LOGICAL_NAME"],
            displayName : apps[i]["DISPLAY_NAME"],
            company : apps[i]["COMPANY"],
            nrb_managed_by : apps[i]["NRB_MANAGED_BY"],
            asignment : apps[i]["ASSIGNMENT"],
            status : apps[i]["ISTATUS"],
            description : apps[i]["DESCRIPTION"],
            vendor : apps[i]["VENDOR"],
            itservice : apps[i]["__EMPTY_4"]
            
          };

          let dateSupport = moment(apps[i]["END_OF_SUPPORT_DATE"], "DD-MM-YYYY") ;
          if(dateSupport.isValid()) app.end_of_support_date = dateSupport.toDate();

          let extendDate = moment(apps[i]["END_EXTENDED_SUPPORT"], "DD-MM-YYYY") ;
          if(extendDate.isValid()) app.end_of_extend_date = extendDate.toDate();
          
          const asyncFunction = async () => {
            let step1 = await db.status.findOne({where: {name: app.status} , attributes: ['status_id']});
            app.status_id = step1.dataValues.status_id;
           
             step1 = await db.provider.findOne({where: {vendor_code: app.vendor_code} , attributes: ['provider_id']})
            app.provider_id = step1.dataValues.provider_id;

            step1 = await db.platforms.findOne({where: {name: namePlatform} , attributes: ['platform_id']})
            app.platform_id = step1.dataValues.platform_id;

            return app;

          }

          asyncFunction().then(app=>{


             db.ci.create({
                name: app.product_code,
                logical_name:app.logicalname, 
                company:app.company,
                nrb_managed_by:app.nrb_managed_by,
                description:app.description,
                platform_id:app.platform_id,
                status_id:app.status_id
              }).then(function(res){

                    db.application.create({
                        itservice: app.itservice,
                        product_code:app.product_code, 
                        version:app.version,
                        is_valid:1,
                        end_of_support_date:app.end_of_support_date,
                        end_extended_support:app.end_of_extend_date ,
                        provider_id:app.provider_id,
                        ci_id:res.dataValues.ci_id
                           
                          });


              });
 


          });


              /* db.status.findOne({where: {name: 'Available'} , attributes: ['status_id']}).then(status =>{
                    app.status_id = status.dataValues.status_id;
              }) */


             // db.provider.findOne({where: {vendor_code: app.vendor_code} , attributes: ['provider_id']}).then(res =>{ app.provider_id = res.dataValues.provider_id;
         



         /*  Provider.findOrCreate({
            where: { vendor_code: provider.vendor_code.trim() },
            defaults: {
                name : provider.name,
                address:provider.address,
                vendor_code :provider.vendor_code, 
                vendor : provider.vendor
            }
            }).then(function(res){
                const platform_id = (namePlatform === 'Z') ? 1 : 2;
        
                Provider_Platform.findOrCreate({
                where: { 
                    [db.Op.and]: [ {platform_id: platform_id}, {provider_id  : res[0].dataValues.provider_id } ]    
                 },
                defaults: {
                    platform_id : platform_id,
                    provider_id  : res[0].dataValues.provider_id
                  }
                })

            }).catch(err => {
                console.log( err);
            });  */
      

 
}


}