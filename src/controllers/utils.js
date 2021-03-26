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