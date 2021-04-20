import { hardwareSubtype } from "./index.db";

const db = require("./index.db");
const { Sequelize, DataTypes, Op } = require("sequelize");

const Platform = db.platforms;
const Status = db.status;
const ClassService = db.classService;
const EnvType = db.envType;
const LparType = db.partitionType;


const platforms = [{ name: 'Z', prefixe: 'Z' }, { name: 'B', prefixe: 'MBULL' }, { name: 'I', prefixe: 'I' }];
const status = [{ name: 'Available' }, { name: 'Operational' }, { name: 'Retired' }, { name: 'Under construction' }, { name: 'Pre-Operation' }, { name: 'Pre-retired' }];
const classServices = [{ name: 'SAAS' }, { name: 'PAAS' }, { name: 'IAAS' }, { name: 'Housing' }, { name: 'Not applicable' }];
const envTypes = [{ name: '0.Laboratoire' }, { name: '1.Développement' }, { name: '2.Homologation' }, { name: '3.Acceptance' }, { name: '9.Unknown' }, { name: '4.Production' }];

const ciTypes = [{ name: 'pserver' }, { name: 'storage' }, { name: 'netcomponent' }, { name: 'lserver' }, { name: 'application' }, { name: 'occurence' }, { name: 'sinstance' }];
const ciSubtypes = [{ name: 'Mainframe LGP' }, { name: 'Mainframe LPAR' }, { name: 'Mainframe Software' }, { name: 'Mainframe Subsystem' }, { name: 'zVM Linux' }, { name: 'Mainframe System' }, { name: 'Mainframe Appliance Console' }, { name: 'Switch' }, { name: 'Mainframe Drive Enclosure' }, { name: 'Mainframe VTS' }, { name: 'Mainframe IBM' }, { name: 'Mainframe Tape Library' }, { name: 'Mainframe Bull' }];








export async function seed() {

    // Insert Platforms initial

    await Promise.all(platforms.map(async(item) => {
        await Platform.findOrCreate({
            where: {
                name: item.name,
                prefixe: item.prefixe
            },
            default: {
                name: item.name,
                prefixe: item.prefixe

            }
        })
    }));

    // Insert Status initial

    await Promise.all(status.map(async(item) => {
        await Status.findOrCreate({
            where: {
                name: item.name
            },
            default: {
                name: item.name
            }
        })
    }));

    // Insert ClassService initial
    await Promise.all(classServices.map(async(item) => {
        await ClassService.findOrCreate({
            where: {
                name: item.name
            },
            default: {
                name: item.name
            }
        })
    }));


    // Insert EnvType initial


    await Promise.all(envTypes.map(async(item) => {
        await EnvType.findOrCreate({
            where: {
                name: item.name
            },
            default: {
                name: item.name
            }
        })
    }));



    // Insert hardwaresType initial

    await Promise.all(ciTypes.map(async(item) => {
        await db.ciType.findOrCreate({
            where: {
                name: item.name
            },
            default: {
                name: item.name
            }
        })
    }));

    // Insert hardwaresType initial

    await Promise.all(ciSubtypes.map(async(item) => {
        await db.ciSubtype.findOrCreate({
            where: {
                name: item.name
            },
            default: {
                name: item.name
            }
        })
    }));


};