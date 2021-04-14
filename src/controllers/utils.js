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