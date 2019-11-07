<template>
  <div class="app-container map-list">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="楼栋信息" required prop="building">
        <el-select v-model="form.building" placeholder="请选择楼栋名称" @change="setBuildFloors">
          <el-option
            v-for="building in buildings"
            :key="building.id"
            :value="building.id"
            :label="building.name"
          />
        </el-select>
        <el-select v-model="form.floor" placeholder="请选择楼层">
          <el-option v-for="n in floors" :key="n" :value="n" :label="`${n}层`" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传地图" prop="src">
        <el-input v-model="form.src" style="display:none;" />
        <el-upload
          class="upload-demo"
          action="http://120.24.54.8/yyServer/file/upload"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :on-success="uploadSuccess"
        >

          <el-button class="el-icon-upload" size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片宽度">
        <el-input v-model="form.width" disabled placeholder="请上传图片" style="width:220px;" />
      </el-form-item>
      <el-form-item label="图片高度">
        <el-input v-model="form.height" disabled placeholder="请上传图片" style="width:220px;" />
      </el-form-item>
      <el-form-item label="说明">
        <el-input v-model="form.descript" type="textarea" placeholder="请输入备注信息" style="width:600px;" />
      </el-form-item>

    </el-form>
    <div class="footer" style="margin-left: 16%;">
      <el-button type="" @click="resetForm">重置</el-button>
      <el-button type="primary" @click="validateDForm">保存</el-button>
    </div>

  </div>
</template>

<script>
import { saveMap, getMapById } from '@//api/ditigal/map'
import { mapGetters } from 'vuex'
import pageMixin from '@/mixins/page'

export default {
  name: 'ImportMap',
  mixins: [pageMixin],
  data() {
    return {
      mapId: '',
      form: {
        id: '',
        building: '',
        floor: '',
        src: '',
        width: '',
        height: '',
        fileName: ''
      },
      floors: 28,
      fileList: [],
      rules: {
        building: [
          { required: true, message: '请选择楼栋信息', trigger: 'change' },
          { validator: this.validateBuilding, trigger: 'change' }
        ],
        floor: [
          { required: true, message: '请选择楼层' }
        ],
        src: [
          { required: true, message: '请上传图片' }
        ]
      },
      imgInfo: {
        width: '',
        height: ''
      }
    }
  },
  computed: {
    ...mapGetters(['buildings'])
  },
  mounted() {
    if (this.$route.params.id) {
      this.getMapDetail(this.$route.params.id)
    }
  },
  methods: {
    /**
     * @description 获取地图详情
     */
    getMapDetail(mapId) {
      this.mapId = mapId
      getMapById(mapId).then(response => {
        this.form = response.data
      })
    },

    /**
     * @description 校验楼栋信息
     */
    validateBuilding(rule, value, callback) {
      if (!value || !this.form.floor) {
        callback(new Error('请选择楼栋信息'))
      } else {
        callback()
      }
    },
    /**
     * @description 上传前处理
     */
    beforeUpload(file) {
      const img = new Image()
      img.onload = () => {
        console.log(img.width, img.height)
        this.imgInfo.width = img.width
        this.imgInfo.height = img.height
      }
      img.src = URL.createObjectURL(file)
    },
    /**
     * @description 上传文件成功回调
     */
    uploadSuccess(response) {
      if (response.statusCode === 0) {
        this.fileList = response.data
        if (this.fileList.length) {
          this.fileList.forEach(item => {
            item.name = item.original
            this.form.src = item.url
            this.form.fileName = item.original
            const { width, height } = this.imgInfo
            this.form.width = width
            this.form.height = height
          })
        }
      } else {
        setTimeout(() => {
          this.fileList = []
        })
        this.$message.error(response.message)
      }
    },
    validateDForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveMap()
        }
      })
    },
    /**
     * @description
     */
    saveMap() {
      saveMap(this.form).then((response) => {
        if (response.statusCode === 0) {
          const message = this.form.id ? '编辑成功' : '新增成功'
          this.$message.success(message)
          this.$router.push('/ditigal/map/list')
        }
      })
    },
    /**
     * @description
     */
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-demo {
  width: 40%;
}
</style>
