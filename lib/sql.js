let sqls = {
    queryWeek(query,date,page) {
        return `http://10.142.24.64:20081/request?query=${query}&st=${date[0]}&et=${date[1]}&type=web&pno=${page}&psize=30&queryFrom=searchtool`
    }
}

module.exports = sqls;