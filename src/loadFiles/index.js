
const path = require('path');
const fs = require('fs');
const insertProviders = require('./insertProviders');
const insertSofts = require('./insertSofts');
const db = require("../index.db");

const insertHardwares = require('./insertHardwares');

exports.test = () => {

    db.application.findAll()
    .then(app => {
        if (app.length === 0) {


    const directoryPath = path.join(__dirname, 'Documents');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            
            switch (file) {

                
                    case 'Refs B.xlsx' : 
                    file = path.resolve( __dirname, "Documents/" + file )
                    insertProviders.insertProvidersB(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));
                    break;

                    case 'Refs Z.xlsx' : 
                    file = path.resolve( __dirname, "Documents/" + file )
                    insertProviders.insertProvidersB(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));
                    break; 

                    case 'CI software B.xlsx' : 
                    file = path.resolve( __dirname, "Documents/" + file )
                    insertSofts.insertApplication(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));
                    break;

                        case 'CI software Z.xlsx' : 
                    file = path.resolve( __dirname, "Documents/" + file )
                    insertSofts.insertApplication(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));
                        break; 

                        case 'CI hardware B.xlsx' : 
                        file = path.resolve( __dirname, "Documents/" + file )
                        insertHardwares.insert(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));
                        break; 

                        case 'CI hardware Z.xlsx' : 
                        file = path.resolve( __dirname, "Documents/" + file )
                        insertHardwares.insert(file,file.substring(file.lastIndexOf(" ")).trim().charAt(0));
                        break;
              } 
        });
    });

}

});

};