const db = require("../index.db");
import moment from 'moment';
import ConsoleAppender from 'simple-node-logger/lib/ConsoleAppender';
const logger = require('../logger');
let compt = 0;
let results = [];

//zVM linux, occurence linux all sauf PROD-NRB

const reader = require('xlsx')


export async function updateOccurences(fileName, namePlatform) {

    const file = reader.readFile(fileName, { type: "string", cellDates: false })
    let data = new Array();
    const sheets = file.SheetNames
    sheets.forEach((res) => {
        data[res] = new Array();
    })

    logger.info('start processing this file : ', fileName);


    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]], {
            raw: false,
        })
        data[sheets[i]] = (temp);

        switch (sheets[i]) {
            case 'CI occurence Z':
                await updateOccurenceElements(temp, namePlatform);
                logger.info(compt, ' instances of  world  ', namePlatform, ' has been updated or added');

                logger.info('end processing this file : ', fileName);
                break;
        }

    }



}


async function updateOccurenceElements(occurences, namePlatform) {

    await insertClient(occurences);

    for (var i = 0; i < occurences.length; i++) {

        const element = occurences[i]["COMPANY"];
        let companies = element.split(',');

        companies.forEach(async oneCompany => {
            const occu = {

                logicalname: occurences[i]["LOGICAL_NAME"],
                company: oneCompany,
            };

            try {

                const asyncFunction = async() => {

                    let step1 = await db.client.findOne({ where: { companyname: occu.company }, attributes: ['client_id'] })
                    occu.client_id = step1.dataValues.client_id;

                    step1 = await db.occurence.findOne({ where: { name: occu.logicalname }, attributes: ['occurencesoft_id'] })
                    occu.occurencesoft_id = step1.dataValues.occurencesoft_id;

                    return occu;

                }

                await asyncFunction().then(async app => {

                    await db.occurence_client.findOrCreate({
                        where: {
                            [db.Op.and]: [{ client_id: app.client_id, occurencesoft_id: app.occurencesoft_id }]
                        },
                        defaults: {
                            client_id: app.client_id,
                            occurencesoft_id: app.occurencesoft_id

                        }
                    })


                });
            } catch (error) {
                logger.error('can\'t insert occurence_client ', occu)

            }
        })







    }



}

async function insertClient(clients) {
    let array = [];
    for (var i = 0; i < clients.length; i++) {

        const element = clients[i]["COMPANY"];
        let companies = element.split(',');

        await companies.forEach(async companyCode => {
            let test = companyCode.trim();
            if (array.indexOf(test) === -1) array.push(test)

        })

    }

    await array.forEach(async companyCode => {
        await setClient(companyCode);

    });
}

async function setClient(companyCode) {
    await db.client.findOrCreate({
        where: { companyname: companyCode },
        defaults: {
            companyname: companyCode,
        }
    });
}