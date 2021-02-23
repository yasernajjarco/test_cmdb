const csvtojson = require('csvtojson'); 
const db = require("../index.db");
const Provider = db.provider;
const Provider_Platform = db.provider_platform;

const reader = require('xlsx') 
 

function insertVendors(vendors,namePlatform){

console.log(namePlatform)
    for (var i = 0; i < vendors.length; i++) { 
        

         const provider = {
            name : vendors[i]["Vendeur"],
            address:"address non known",
            vendor_code : vendors[i]["Code"], 
            vendor : vendors[i]["Vendeur"]
          }; 

          Provider.findOrCreate({
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
                    [db.Op.or]: [ {platform_id: platform_id}, {provider_id  : res[0].dataValues.provider_id } ]    
                 },
                defaults: {
                    platform_id : platform_id,
                    provider_id  : res[0].dataValues.provider_id
                  }
                })

            }).catch(err => {
                console.log( err);
            }); 
      

 
}


}


/* {
  'Clé': 'ABS-VTO 5.8',
  EOS: '-',
  'EOS+': '-',
  'Nom CMDB': 'VTOM',
  'Nom constructeur': 'VTOM'
}
 */

function insertSofts(softs){


    for (var i = 0; i < softs.length; i++) { 
        
         const provider = {
            NomCons : softs[i]["Nom constructeur"],
            EOS : softs[i]["EOS"], 
            EOSPlus : softs[i]["EOS+"],
            NameCmdb : softs[i]["Nom CMDB"],
            key:softs[i]["Clé"]
            
          }; 

         console.log(provider)

          /*

           Provider.findOrCreate({
            where: { vendor_code: provider.vendor_code.trim() },
            defaults: {
                name : provider.name,
                address:provider.address,
                vendor_code :provider.vendor_code, 
                vendor : provider.vendor
            }
            }).then(function(){
              console.log("callback!!");
            }).catch(err => {
                console.log( err);
            });  */
      
 
    }

}



export function insertProvidersB(fileName,namePlatform){

    const file = reader.readFile(fileName) 
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
        case 'Vendeurs':
         insertVendors(temp,namePlatform);
          break;

          case 'Soft':
         insertSofts(temp);
          break;
      }

    } 

   

       

}