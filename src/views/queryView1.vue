<template>
    <el-main>
        <query-header-view
                :today="header.today"
                :output="header.output"
                @queryData="queryData"
                :containLoading="containLoading">
        </query-header-view>
        <query-table-view
                :tableLoading="tableLoading"
                :tableData="tableData"
                v-if="Object.keys(tableData).length">
        </query-table-view>
        <footer-view
                :pageData="pageData"
                v-if="pageData > 0"
                :query="header.query"
                :date="header.date"
                @queryData="queryData">
        </footer-view>
        <blank-view
                v-if="containLoading.switch"
                :ins="containLoading.instance">
        </blank-view>
    </el-main>
</template>

<script>
    import queryHeaderView from './commonViews/queryHeaderView'
    import queryTableView from './commonViews/queryTableView'
    import footerView from './commonViews/footerView'
    import blankView from './commonViews/blankView'
    let sqls = require('../../lib/sql')

    export default {
        data(){
            return {
                header : {
                    today : true,
                    output : true,
                    date : '',
                    query : ''
                },
                tableData : {},
                pageData : 0,
                containLoading : {
                    instance : false,
                    switch : true
                },
                tableLoading : {
                    instance : false,
                    switch : true
                }
            }
        },
        components : {queryHeaderView,queryTableView,footerView,blankView},
        methods : {
            queryData(query,date,page,type){

                if(type && type == 'pageChange')
                    this.tableLoading.instance = true

                this.header.query = query;
                this.header.date = date;
                let u = sqls.queryWeek(query,date,page);

                this.$http.jsonp(u).then(res => {
                    console.log(res.data)
                    if(!type)
                        this.tableData = this.buildTable(res.data)
                    this.containLoading.switch = false;
                    this.containLoading.instance.visible = false;

                    if(type && type == 'pageChange'){
                        setTimeout(() => {
                            this.tableData = this.buildTable(res.data)
                            this.tableLoading.instance = false
                        },200)
                    }

                },err => {
                    console.log(err)
                })
            },
            buildTable(data){
                let realData = {
                    title : [],
                    body : []
                };
                realData.title = ['query',...Object.keys(data.count),'total','其他'];

                let firstLine = {'query':'总体','其他':''},sum = 0;

                for(let k in data.count){
                    sum += Number(data.count[k])
                    firstLine[k] = data.count[k]
                }

                firstLine['total'] = sum;

                realData.body.push(firstLine);

                for(let d in data.doc){
                    let doc = data.doc[d],tmp = {};
                    tmp.query = doc.title

                    for(let k in doc.web){
                        tmp[k] = doc.web[k].pv
                    }
                    tmp.total = doc.count
                    tmp['其他'] = '历史PV SA'
                    realData.body.push(tmp)
                }

                this.pageData = Number(data.total)
                return realData
            }
        }
    }
</script>