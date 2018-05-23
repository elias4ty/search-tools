<template>
    <div class="jingque">
        <div class="time">
            <span class="title">搜索 PV</span>
            <el-button-group>
                <el-button size="mini" type="success">整月</el-button>
                <el-button size="mini" type="success">整年</el-button>
                <el-button size="mini" type="success">半年</el-button>
                <el-button size="mini" type="success">季度</el-button>
                <el-button size="mini" type="success">一周</el-button>
            </el-button-group>
            <el-date-picker
                    v-model="haha"
                    format="yyyy-MM-dd"
                    size="small"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </div>
        <el-row>
            <el-col>
                <el-tag closable type="info">
                    哈哈
                </el-tag>
                <el-tag closable type="info">
                    哈哈
                </el-tag>
                <el-tag closable type="info">
                    哈哈
                </el-tag>
                <el-input
                        size="small"
                        placeholder="添加对比词"
                        clearable
                        prefix-icon="el-icon-circle-plus-outline"></el-input>
                <el-button size="small" type="primary">确定</el-button>
            </el-col>
        </el-row>
        <div id="chart"></div>
    </div>
</template>

<style>
    .jingque .time{
        border-bottom: 3px solid #F2F2F2;
        font-size: 20px;
        padding-bottom: 8px;
        margin-bottom: 8px;
        font-weight:bold;
    }

    .jingque .time .title,.jingque .el-button-group{
        vertical-align: middle;
        margin-right: 15px;
    }

    .jingque .el-input{
        width: auto;
        margin: 0 10px;
    }

    .jingque .el-row{
        margin-bottom: 5px;
    }

    .jingque #chart{
        margin: 40px auto 0;
        width: 80%;
    }
</style>

<script>
    import G2 from '@antv/g2';
    import DataSet from '@antv/data-set';

    export default {
        props:['chartData','dateArr'],
        data(){
            return {
                chart : null,
                haha : this.dateArr
            }
        },
        methods:{
            chartFlow(val,names){
                let data = val;
                this.chart = new G2.Chart({
                    id: 'chart',
                    width : 1000,
                    height : 400
                });
                let ds = new DataSet();
                let dv = ds.createView().source(data);
                dv.transform({
                    type: 'fold',
                    fields: names,
                    key: 'query',
                    value: 'count'
                });
                this.chart.source(dv);
                this.chart.tooltip({
                    crosshairs : {
                        type : 'y'
                    }
                })

                this.chart.scale('count',{
                    alias : '统计次数'
                })

                this.chart.axis('date',{
                    formatter(val){
                        let newVal = [val.substring(0,4),val.substring(4,6),val.substring(6)].join('-')
                        return newVal
                    }
                })

                this.chart.line().position('date*count').color('query').tooltip('date*count*query',(date,count,query) =>{
                    return {
                        title : date,
                        name: query,
                        value : count
                    }
                })
                this.chart.point().position('date*count').size(4).shape('hollow').color('query')
                this.chart.render();
            }
        },
        watch : {
            chartData(val){
                let cd = [],x = val.xAxis.data,mult = val.series,i=0,names = [];

                while(i < x.length){
                    let item = {'date': x[i]};

                    mult.map(val => {
                        if(i == 0)
                            names.push(val.name)
                        item[val.name] = val.data[i]
                    })
                    cd.push(item)
                    i++
                }
                console.log(cd)
                if(this.chart)
                    this.chart.destroy();
                else
                    this.chartFlow(cd,names)
            }
        }
    }
</script>