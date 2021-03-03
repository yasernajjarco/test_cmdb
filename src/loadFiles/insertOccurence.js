const db = require("../index.db");
import moment from 'moment';
const logger = require('../logger');
let compt = 0;



const reader = require('xlsx') 
 

export async function insert(fileName,namePlatform){

    const file = reader.readFile(fileName,{type: "string", cellDates: false}) 
    let data = new Array();
    const sheets = file.SheetNames 
    sheets.forEach((res) => { 
        data[res] = new Array();
     })

    for(let i = 0; i < sheets.length; i++) 
    {
       const temp = reader.utils.sheet_to_json(  file.Sheets[file.SheetNames[i]],{
        raw: false,
      }) 
       data[sheets[i]] = (temp);

       switch (sheets[i]) {
        case 'occurence|Mainframe Subsystem':
         await insertOccurences(temp,namePlatform);
        // console.log('softs => ' ,temp)

          break;
      }

    } 
    logger.info(compt ,' instances de monnde ' , namePlatform ,' a été ajoutés');

     

}


async function insertOccurences(apps,namePlatform){

  var i = await insertClient(apps);
    for (var i = 1; i < apps.length; i++) { 
        
      

         const occu = {
            ourName : apps[i]["__EMPTY"],
            product_code : (apps[i]["APPLICATION"]).substring(apps[i]["APPLICATION"].indexOf(' ')+1,apps[i]["APPLICATION"].lastIndexOf(' ') ),   
            version : (apps[i]["APPLICATION"]).substring(apps[i]["APPLICATION"].lastIndexOf(' ')+1).trim(),   

            softinstance : apps[i]["__EMPTY_2"],           
            system : apps[i]["NETWORK_NAME"].trim(),
            type : apps[i]["TYPE"],
            subtype : apps[i]["SUBTYPE"], 
            logicalname : apps[i]["LOGICAL_NAME"],
            displayName : apps[i]["DISPLAY_NAME"],
            company : apps[i]["COMPANY"],
            nrb_managed_by : apps[i]["NRB_MANAGED_BY"],
            asignment : apps[i]["ASSIGNMENT"],
            status : apps[i]["ISTATUS"],
            description : apps[i]["DESCRIPTION"],
           
            
          };

            try {
  
              const asyncFunction = async () => {

              let step1 = await db.systems.findOne({
                include: [{ model: db.ci, as: 'ci' , attributes: [], where: { logical_name: occu.system } }],
               })
               occu.systeme_id = step1.dataValues.systeme_id;
           
               step1 = await db.application.findOne({where: {product_code: occu.product_code , version : occu.version} , attributes: ['ci_application_id']})
               occu.ci_application_id = step1.dataValues.ci_application_id;

               step1 = await db.client.findOne({where: {companyname: occu.company } , attributes: ['client_id']})
               occu.client_id = step1.dataValues.client_id;

            return occu;

          }

          await asyncFunction().then(async app=>{

              await db.instance.findOrCreate({
                where: { name: app.ourName },
                defaults: {
                name: app.ourName,
                ci_application_id: app.ci_application_id,
                systeme_id : app.systeme_id,
                isoccurenciable : 1
                }
              }).then(async function(res){
                  compt++;
              });  

          }); 
          } catch (error) {
            logger.error('can\'t insert instance ', occu, 'Error => ', error )

          } 
 


}


  async function insertClient(apps) {
    for (var i = 1; i < apps.length; i++) {
      const occu = { company: apps[i]["COMPANY"] };

      await db.client.findOrCreate({
        where: { companyname: occu.company },
        defaults: {
          companyname: occu.company,
        }
      });

    }
    return i;
  }
}