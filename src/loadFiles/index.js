
const path = require('path');
const fs = require('fs');
const insertProviders = require('./insertProfiders');





exports.test = () => {

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
              } 
        });
    });

};