const db = require("../index.db");
const { Sequelize, DataTypes, Op } = require("sequelize");

export function first(array) {
    if (array == null)
        return {};
    if (array.length == 0)
        return {}
    return array[0];
};

export function buildObject(data) {
    let keys = Object.keys(data);

    keys.forEach(key => {
        if (key.substring(0, 1) == "_") {
            let name = key.substring(1, key.indexOf(' ')).trim();
            let attribut = key.substring(key.indexOf(' ')).trim();

            if (data[name] == null) data[name] = {}

            data[name][attribut] = data[key];
            delete data[key];

        }

    })
    return data;
}
export async function getLastAudit(result) {
    try {
        let audit = null;
        await db.audit.findAll({
            where: { ci_id: result.id },
            attributes: [
                ['audituser', 'user'],
                ['auditdescription', 'description'],
                ['audittimestamp', 'last_update']
            ]
        }).map(data => { return data.toJSON() }).then(data => {
            new Date(Math.max(...data.map(e => new Date(e.last_update))));
            audit = (first(data.sort().reverse()))
        });
        return audit;
    } catch (error) {
        return null;
    }

}


export async function get_classService_id(name) {
    try {
        let step1 = await db.classService.findOne({ where: { name: name }, attributes: ['class_service_id'] })
        return step1.dataValues.class_service_id;
    } catch (error) {
        throw new Error('class_service not found or class_service does not exist');

    }
}

export async function get_status_id(name) {
    try {
        let step1 = await db.status.findOne({ where: { name: name }, attributes: ['status_id'] });
        return step1.dataValues.status_id;
    } catch (error) {
        throw new Error('status not found or status does not exist');
    }

}
export async function get_environnement_id(name) {
    try {
        let step1 = await db.envType.findOne({ where: { name: name }, attributes: ['env_type_id'] })
        return step1.dataValues.env_type_id;
    } catch (error) {
        throw new Error('environnement not found or environnement does not exist');
    }

}