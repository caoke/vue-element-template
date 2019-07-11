<template>
    <div class="export-excel">
        <div>
            <label class="radio-label" style="padding-left: 0px;">Filename:</label>
            <el-input v-model="filename" style="width:350px;" prefix-icon="el-icon-document"></el-input>

            <label class="radio-label">Book Type：</label>
            <el-select v-model="bookType">
                <el-option v-for="item in bookTypes" :key="item" :value="item" :label="item"></el-option>
            </el-select>

            <el-button type="primary" @click="download" style="margin-left: 20px;" v-permission="['edtior', 'admin']">导出</el-button>
        </div>
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
            filename: '',
            bookType: 'xlsx',

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
            ],
            bookTypes: ['xlsx', 'csv', 'txt']
        }
    },
    methods: {
        download() {
            const filterVal=['id', 'title', 'description']
            const header = this.ths.map(item =>{
                return item.label
            })
            const data = this.formatJson(filterVal, this.list)
            
            const file = `${this.filename}.${this.bookType}` || 'test.xlsx'

            data.unshift(header)

            const ws = XLSX.utils.aoa_to_sheet(data)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, this.filename)

            XLSX.writeFile(wb, file)

            
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
    .radio-label {
        font-size: 14px;
        color: #606266;
        font-weight: 600;
        line-height: 40px;
        padding: 0 12px 0 30px;
    }
}
</style>
