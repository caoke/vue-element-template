<template>
  <div class="app-container map-list">
    <el-form :model="form">
      <el-form-item label="楼栋名称" required >
          <el-select v-model="form.buildingName" placeholder="请输入并选择楼栋名称">
            <el-option v-for="building in buildingNameOptions" :key="building.id" :value="building.id" :label="building.name"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="楼层" required >
        <el-select v-model="form.level" placeholder="请选择楼层">
          <el-option v-for="n in levels" :key="n" :value="n" :label="n"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传地图">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否启用">
        
      </el-form-item>
      <el-form-item label="地图背景色">
        <el-color-picker v-model="form.color"></el-color-picker>
      </el-form-item>
      <el-form-item label="说明">
        <el-input v-model="form.descript" type="textarea" placeholder="请输入备注信息"></el-input>
      </el-form-item>
    </el-form>

    
  </div>
</template>

<script>
export default {
  name: 'ImportMap',
  data() {
    return{
      form: {
        buildingName: '',
        level: '',
        color: ''
      },
      buildingNameOptions: [
        {
          id: 1, 
          name: '住院部'
        }
      ],
      levels: 28
    }
  },
  methods:{

  }
}
</script>

<style>

</style>
