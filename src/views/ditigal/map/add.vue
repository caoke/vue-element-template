<template>
  <div class="app-container map-list">
    <el-form :model="form" ref="form" :rules="rules" label-width="90px">
      <el-form-item label="楼栋名称" required prop="building">
        <el-select v-model="form.building" placeholder="请输入并选择楼栋名称">
          <el-option v-for="building in buildingNameOptions" :key="building.id" :value="building.id" :label="building.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="楼层" required prop="floor">
        <el-select v-model="form.floor" placeholder="请选择楼层">
          <el-option v-for="n in floors" :key="n" :value="n" :label="n" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传地图" prop="src">
        <el-input v-model="form.src" style="display:none;"></el-input>
        <el-upload
          class="upload-demo"
          drag
          action="http://120.24.54.8/yyServer/file/upload"
          :file-list="fileList"
          :on-success="uploadSuccess"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="说明">
        <el-input v-model="form.descript" type="textarea" placeholder="请输入备注信息" />
      </el-form-item>
      
    </el-form>
    <div class="footer" style="text-align: center">
      <el-button type="" @click="resetForm">重置</el-button>
      <el-button type="primary" @click="validateDForm">保存</el-button>
    </div>

  </div>
</template>

<script>
import { saveMap } from '@/api/map'
export default {
  name: 'ImportMap',
  data() {
    return {
      form: {
        id: '',
        building: '',
        floor: '',
        color: '',
        src: 'http://120.24.54.8/yyServer/file/image/5d6fc8dee4b0a2cc117cb459',
        width: 100,
        height: 100
      },
      buildingNameOptions: [
        {
          id: 1,
          name: '住院部'
        }
      ],
      floors: 28,
      fileList: [],
      rules: {
        building: [
          { required: true, message: "请选择楼栋"}
        ],
        floor: [
          { required: true, message: "请选择楼层"}
        ],
        src: [
          { required: true, message: "请上传图片"}
        ]
      }
    }
  },
  methods: {
    /**
     * @description 上传文件成功回调
     */
    uploadSuccess(response) {
      console.log(response)
      if (response.statusCode === 0) {
        this.fileList = response.data
        if(this.fileList.length) {
          this.fileList.forEach(item => {
            item.name = item.original
            this.form.src = item.url
          })
        }
        this.$message.success(response.message)
      } else {
        setTimeout(() => {
          this.fileList = []
        })
        this.$message.error(response.message)
      }
    },
    validateDForm() {
      this.$refs.form.validate(valid => {
        if(valid) {
          this.saveMap()
        }
      })
    },
    /**
     * @description
     */
    saveMap() {
      saveMap(this.form).then((response) =>{
        if(response.statusCode === 0){
          let message =this.form.id ? '编辑成功' : '新增成功'
          this.$message.success(message)
          this.$router.push('/ditigal/map/list')
        }
      })
    },
    /**
     * @description 
     */
    resetForm(){
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style>

</style>
