<template>
    <div class="export-excel">
        <el-button type="primary" @click="download">导出</el-button>
        <el-table :data="list" ref="table">
            <el-table-column
                v-for="item in ths"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import XLSX from 'xlsx';
export default {
    name: 'exportExcel',
    data() {
        return{
            list: [
                {
                    id: 1,
                    title: 'ttttttt',
                    description: '11111111111111111111111111111111111111111111111'
                },
                {
                    id: 2,
                    title: 'ddddd',
                    description: 'tygsjhsgdfh'
                }
            ],
            ths: [
                {
                    label: 'id',
                    prop: 'id'
                },
                {
                    label: '标题',
                    prop: 'title'
                },
                {
                    label: '描述',
                    prop: 'description'
                }
            ]
        }
    },
    methods: {
        download() {
            const filterVal=['id', 'title', 'description']
            const header = this.ths.map(item =>{
                return item.label
            })
            const data = this.formatJson(filterVal, this.list)

            data.unshift(header)
            
            const ws = XLSX.utils.aoa_to_sheet(data)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'test')
            XLSX.writeFile(wb, "test.xlsx")

            
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        }
    }
}
</script>

<style lang="scss" scoped>
.export-excel{
    padding: 0 32px;
}
</style>
