
const path = require('path');
const fs = require('fs');
const insertProviders = require('./insertProviders');
const insertSofts = require('./insertSofts');
const db = require("../index.db");
const insertHardwares = require('./insertHardwares');
const insertVirtuels = require('./insertVirtuels');


async function test() {
    let file='';
    await db.application.findAll()
    .then(async app => {
        if (app.length !== 0) {


    const directoryPath = path.join(__dirname, 'Documents');

   await fs.readdir(directoryPath,async function (err, files) {

/*                 
                    file = path.resolve( __dirname, "Documents/" + 'Refs B.xlsx' )
                    await  insertProviders.insertProvidersB(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));
 
                    file = path.resolve( __dirname, "Documents/" + 'Refs Z.xlsx' )
                    await insertProviders.insertProvidersB(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));

                    file = path.resolve( __dirname, "Documents/" + 'CI software B.xlsx' )
                    await insertSofts.insertApplication(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));

                    file = path.resolve( __dirname, "Documents/" + 'CI software Z.xlsx' )
                    await insertSofts.insertApplication(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0)); 


                     
                     file = path.resolve( __dirname, "Documents/" + 'CI hardware B.xlsx' )
                    await insertHardwares.insert(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));


                    file = path.resolve( __dirname, "Documents/" + 'CI hardware Z.xlsx' )
                    await insertHardwares.insert(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));
 */
                    file = path.resolve( __dirname, "Documents/" + 'CI virtual B.xlsx' )
                    await insertVirtuels.insert(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));

                   file = path.resolve( __dirname, "Documents/" + 'CI virtual Z.xlsx' )
                   await insertVirtuels.insert(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0)); 
/*
                   file = path.resolve( __dirname, "Documents/" + 'REL hardware Z pserver.csv' )
                   await insertHardwares.insertRelation(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));
                     */
 
                     

     
    });

}

});

};

module.exports.test = test;
