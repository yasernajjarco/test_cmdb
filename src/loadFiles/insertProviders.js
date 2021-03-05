const csvtojson = require('csvtojson');
const db = require("../index.db");
const Provider = db.provider;
const Provider_Platform = db.provider_platform;
const logger = require('../logger');

const reader = require('xlsx')
let compt = 0;


export async function insertProvidersB(fileName, namePlatform) {

    const file = reader.readFile(fileName)
    let data = new Array();
    const sheets = file.SheetNames
    sheets.forEach((res) => {
        data[res] = new Array();
    })

    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
        data[sheets[i]] = (temp);



        switch (sheets[i]) {
            case 'Vendeurs':
                await insertVendors(temp, namePlatform);
                console.log('vendors => ', temp)
                break;
        }

    }
    logger.info(compt, ' Vendeurs de monnde ', namePlatform, ' a été mis à jour ou ajoutés');
}



async function insertVendors(vendors, namePlatform) {

    for (var i = 0; i < vendors.length; i++) {
        const provider = {
            name: vendors[i]["Vendeur"],
            address: "",
            vendor_code: vendors[i]["Code"],
            vendor: vendors[i]["Vendeur"]
        };

        try {

            const asyncFunction = async() => {
                let step1 = await db.platforms.findOne({ where: { name: namePlatform }, attributes: ['platform_id'] });
                provider.platform_id = step1.dataValues.platform_id;

                return provider;
            };

            await asyncFunction().then(async provider => {
                await Provider.findOrCreate({
                    where: { vendor_code: provider.vendor_code },
                    defaults: {
                        name: provider.name,
                        address: provider.address,
                        vendor_code: provider.vendor_code,
                        vendor: provider.vendor
                    }
                }).then(async function(res) {

                    await Provider_Platform.findOrCreate({
                        where: {
                            [db.Op.and]: [{ platform_id: provider.platform_id }, { provider_id: res[0].dataValues.provider_id }]
                        },
                        defaults: {
                            platform_id: provider.platform_id,
                            provider_id: res[0].dataValues.provider_id
                        }
                    })

                }).then(() => {
                    compt++;

                }).catch(err => {
                    console.log(err);
                });
            });

        } catch (error) {

            logger.error('can\'t insert provider ', provider, 'Error => ', error)

        }






    }


}