const path = require('path');
const fs = require('fs');
const insertProviders = require('./insertProviders');
const insertSofts = require('./insertSofts');
const insertOccurence = require('./insertOccurence');

const db = require("../index.db");
const insertHardwares = require('./insertHardwares');
const insertVirtuels = require('./insertVirtuels');
const instances = require('./instances');
const updateCopany = require('./updateCopany');

const XLSX = require('xlsx');
let clients_instance_z;


const logger = require('../logger');


async function test() {
    let file = '';


    const directoryPath = path.join(__dirname, 'Documents');

    await fs.readdir(directoryPath, async function(err, files) {

        file = path.resolve(__dirname, "Documents/" + 'Refs B.xlsx')
        await insertProviders.insertProvidersB(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));


        file = path.resolve(__dirname, "Documents/" + 'Refs Z.xlsx')
        await insertProviders.insertProvidersB(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));

        file = path.resolve(__dirname, "Documents/" + 'CI software B.xlsx')
        await insertSofts.insertApplication(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));


        file = path.resolve(__dirname, "Documents/" + 'CI software Z.xlsx')
        await insertSofts.insertApplication(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));


        file = path.resolve(__dirname, "Documents/" + 'CI hardware B.xlsx')
        await insertHardwares.insert(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));



        file = path.resolve(__dirname, "Documents/" + 'CI hardware Z.xlsx')
        await insertHardwares.insert(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));


        file = path.resolve(__dirname, "Documents/" + 'CI virtual B.xlsx')
        await insertVirtuels.insert(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));

        file = path.resolve(__dirname, "Documents/" + 'CI virtual Z.xlsx')
        await insertVirtuels.insert(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0)).then(async(data) => {

            if (data !== undefined) {
                clients_instance_z = data;

                var ws = XLSX.utils.json_to_sheet(data);
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "CI Linux");
                await XLSX.writeFile(wb, path.resolve(__dirname, 'Exported_files/', 'linux_clients Z.xlsx'));
            }
        });


        file = path.resolve(__dirname, "Documents/" + 'REL hardware Z pserver.csv')
        await insertHardwares.insertRelation(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));


        file = path.resolve(__dirname, "Documents/" + 'REL hardware B pserver.csv')
        await insertHardwares.insertRelation(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));

        file = path.resolve(__dirname, "Documents/" + 'REL hardware B storage.csv')
        await insertHardwares.insertRelation(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));

        file = path.resolve(__dirname, "Documents/" + 'CI sinstance B.xlsx')
        await instances.insertInstances(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0)).then(async(data) => {
            var ws = XLSX.utils.json_to_sheet(data);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "CI sinstance B");
            await XLSX.writeFile(wb, path.resolve(__dirname, 'Exported_files/', 'sinstances_clients B.xlsx'));

        });


        file = path.resolve(__dirname, "Documents/" + 'CI sinstance Z.xlsx')
        await instances.insertInstances(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0)).then(async(data) => {
            clients_instance_z = data;

        });








        file = path.resolve(__dirname, "Documents/" + 'CI software B.xlsx')
        await insertOccurence.insert(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0)).then(async(data) => {
            var ws = XLSX.utils.json_to_sheet(data);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "CI occurence B");
            await XLSX.writeFile(wb, path.resolve(__dirname, 'Exported_files/', 'occurences_clients B.xlsx'));
        });


        file = path.resolve(__dirname, "Documents/" + 'CI software Z.xlsx')
        await insertOccurence.insert(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0)).then(async(data) => {
            var ws = XLSX.utils.json_to_sheet(data);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "CI occurence Z");
            await XLSX.writeFile(wb, path.resolve(__dirname, 'Exported_files/', 'occurences_clients Z.xlsx'));
        });


        // update company
        file = path.resolve(__dirname, "update company/" + 'occurences_clients Z.xlsx')
        await updateCopany.updateOccurences(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));

        file = path.resolve(__dirname, "update company/" + 'CI virtual Z.xlsx')
        await updateCopany.updateSystemes(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));

        file = path.resolve(__dirname, "update company/" + 'linux_clients Z.xlsx')
        await updateCopany.updateLinux(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));

        file = path.resolve(__dirname, "update company/" + 'CI hardware B.xlsx')
        await updateCopany.updateHardware(file, file.substring(file.lastIndexOf(" ")).trim().charAt(0));
        //////////////////////////////////

        let time = await new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        await logger.info('End at: ', time)

        // await generateFiles();


    });


};




async function generateFiles() {

    await removeElementsNoOccurenciables(clients_instance_z).then(result => {

        var ws = XLSX.utils.json_to_sheet(result);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "CI sinstance Z");
        XLSX.writeFile(wb, path.resolve(__dirname, 'Exported_files/', 'sinstances_clients Z.xlsx'));

    });
}

async function removeElementsNoOccurenciables(data) {
    return await new Promise(async function(resolve) {
        let result = [];


        for (var i = 0; i < data.length; i++) {
            let element = data[i]

            let code_product = element.APPLICATION.substring(element.APPLICATION.indexOf(' ') + 1, element.APPLICATION.lastIndexOf(' '));
            let version = (element.APPLICATION.substring(element.APPLICATION.lastIndexOf(' ') + 1)).trim();

            let step1 = await db.application.findOne({ where: { product_code: code_product, version: version }, attributes: ['isoccurenciable'] })
            let isoccurenciable = step1.dataValues.isoccurenciable;
            //element.isoccurenciable = step1.dataValues.isoccurenciable;

            if (isoccurenciable == null) {
                result.push(element)

            }

        }

        resolve(result);
    });
}

module.exports.test = test;