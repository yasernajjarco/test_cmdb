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

    await insertClient(occurences, false);

    for (var i = 0; i < occurences.length; i++) {

        const element = occurences[i]["COMPANY_BREAKDOWN"];
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

async function insertClient(clients, isShared) {
    let array = [];
    for (var i = 0; i < clients.length; i++) {

        const element = clients[i]["COMPANY_BREAKDOWN"];
        if (element != undefined) {
            let companies = element.split(',');

            await companies.forEach(async companyCode => {
                let test = companyCode.trim();
                if (array.indexOf(test) === -1) array.push(test)

            })
        }


    }

    await array.forEach(async companyCode => {
        await setClient(companyCode, isShared);

    });
}

async function setClient(companyCode, isShared) {

    if (isShared) {
        await upsert(db.client, { companyname: companyCode }, {
            companyname: companyCode,
            isshared: 1
        });
    } else {
        await db.client.findOrCreate({
            where: { companyname: companyCode },
            defaults: {
                companyname: companyCode,
                isshared: 1
            }
        });
    }

}



async function upsert(Model, condition, values) {
    return Model
        .findOne({ where: condition })
        .then(function(obj) {
            // update
            if (obj)
                return obj.update(values);
            // insert
            return Model.create(values);
        })
}

/////////////////////////////////////////////



export async function updateClients(fileName, namePlatform) {

    const file = reader.readFile(fileName, { type: "string", cellDates: false })
    let data = new Array();
    const sheets = file.SheetNames
    sheets.forEach((res) => { data[res] = new Array() })

    logger.info('start processing this file : ', fileName);


    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], { raw: false });

    data[sheets[0]] = (temp);
    let platforms = [];
    await db.platforms.findAll().map(data => data.toJSON()).then(res => { platforms = [...res] });



    await temp.forEach(async element => {
        let client_id = element.client_id;

        if (element.inworld_B != null && element.inworld_B != undefined) {
            let platform_id = platforms.find(x => x.name == 'B').platform_id;
            await db.client_platform.findOrCreate({
                where: {
                    [db.Op.and]: [{ platform_id: platform_id }, { client_id: client_id }]
                },
                defaults: { platform_id: platform_id, client_id: client_id }
            })

        }
        if (element.inworld_Z != null && element.inworld_Z != undefined) {
            let platform_id = platforms.find(x => x.name == 'Z').platform_id;
            await db.client_platform.findOrCreate({
                where: {
                    [db.Op.and]: [{ platform_id: platform_id }, { client_id: client_id }]
                },
                defaults: { platform_id: platform_id, client_id: client_id }
            })
        }
        if (element.inworld_I != null && element.inworld_I != undefined) {
            let platform_id = platforms.find(x => x.name == 'I').platform_id;
            await db.client_platform.findOrCreate({
                where: {
                    [db.Op.and]: [{ platform_id: platform_id }, { client_id: client_id }]
                },
                defaults: { platform_id: platform_id, client_id: client_id }
            })
        }
    })





}
export async function updateSystemes(fileName, namePlatform) {

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
            case 'Feuil1':
                console.log(temp)
                await updateSystemeElements(temp, namePlatform);
                break;
        }

    }



}


async function updateSystemeElements(systemes, namePlatform) {

    await insertClient(systemes, true);

    for (var i = 0; i < systemes.length; i++) {

        const element = systemes[i]["COMPANY_BREAKDOWN"];
        let companies = element.split(',');

        companies.forEach(async oneCompany => {
            const occu = {

                logicalname: systemes[i]["__EMPTY_2"],
                company: oneCompany,
            };

            try {

                const asyncFunction = async() => {

                    let step1 = await db.client.findOne({ where: { companyname: occu.company }, attributes: ['client_id'] })
                    occu.client_id = step1.dataValues.client_id;

                    step1 = await db.systems.findOne({ where: { '$ci.logical_name$': occu.logicalname }, attributes: ['systeme_id'], include: [{ model: db.ci, required: false, as: 'ci', attributes: [] }] })
                    occu.systeme_id = step1.dataValues.systeme_id;

                    return occu;

                }

                await asyncFunction().then(async app => {

                    await db.client_systeme.findOrCreate({
                        where: {
                            [db.Op.and]: [{ client_id: app.client_id, systeme_id: app.systeme_id }]
                        },
                        defaults: {
                            client_id: app.client_id,
                            systeme_id: app.systeme_id

                        }
                    })


                });
            } catch (error) {
                logger.error('can\'t insert client_systeme ', occu)

            }
        })

    }



}

export async function updateLinux(fileName, namePlatform) {

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
            case 'CI Linux':
                console.log(temp)
                await updateLinuxElements(temp, namePlatform);
                break;
        }

    }



}

async function updateLinuxElements(linuxs, namePlatform) {

    await insertClient(linuxs, false);

    for (var i = 0; i < linuxs.length; i++) {

        const element = linuxs[i]["COMPANY_BREAKDOWN"];
        let companies = element.split(',');

        companies.forEach(async oneCompany => {
            const occu = {

                logicalname: linuxs[i]["LOGICAL_NAME"],
                company: oneCompany,
            };

            try {

                const asyncFunction = async() => {

                    let step1 = await db.client.findOne({ where: { companyname: occu.company }, attributes: ['client_id'] })
                    occu.client_id = step1.dataValues.client_id;

                    step1 = await db.zLinux.findOne({ where: { '$ci.logical_name$': occu.logicalname }, attributes: ['zlinux_id'], include: [{ model: db.ci, required: false, as: 'ci', attributes: [] }] })
                    occu.zlinux_id = step1.dataValues.zlinux_id;

                    return occu;

                }

                await asyncFunction().then(async app => {

                    await db.client_zlinux.findOrCreate({
                        where: {
                            [db.Op.and]: [{ client_id: app.client_id, zlinux_id: app.zlinux_id }]
                        },
                        defaults: {
                            client_id: app.client_id,
                            zlinux_id: app.zlinux_id

                        }
                    })


                });
            } catch (error) {
                logger.error('can\'t insert zlinux_client ', occu)

            }
        })







    }



}

export async function updateHardware(fileName, namePlatform) {

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

        await updateHardwareElements(temp, namePlatform);


    }



}


async function updateHardwareElements(hardwares, namePlatform) {

    await insertClient(hardwares, false);

    for (var i = 0; i < hardwares.length; i++) {


        const element = hardwares[i]["COMPANY_BREAKDOWN"];
        if (element != undefined) {
            let companies = element.split(',');

            companies.forEach(async oneCompany => {
                const occu = {

                    serial_no: hardwares[i]["SERIAL_NO"],
                    company: oneCompany,
                };

                try {

                    const asyncFunction = async() => {

                        let step1 = await db.client.findOne({ where: { companyname: occu.company }, attributes: ['client_id'] })
                        occu.client_id = step1.dataValues.client_id;

                        step1 = await db.hardwares.findOne({ where: { serial_no: occu.serial_no }, attributes: ['hardware_id'] })
                        occu.hardware_id = step1.dataValues.hardware_id;

                        return occu;

                    }

                    await asyncFunction().then(async app => {

                        await db.client_hardware.findOrCreate({
                            where: {
                                [db.Op.and]: [{ client_id: app.client_id, hardware_id: app.hardware_id }]
                            },
                            defaults: {
                                client_id: app.client_id,
                                hardware_id: app.hardware_id

                            }
                        })


                    });
                } catch (error) {
                    logger.error('can\'t insert client_systeme ', occu)

                }
            })
        }



    }



}