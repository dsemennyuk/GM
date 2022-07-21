const idSelector = (node) => node.value.id;

const findNodeById = (list, id) => {
    return list.find(id, idSelector);
}

module.exports = {
    findNodeById: findNodeById
}