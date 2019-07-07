<template>
  <div class="home">
    <h2>定位信息管理流程</h2>
    <div class="home-container">

      <el-row :gutter="40" class="panel-group">

        <el-col :span="6"  class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper green">
              <i class="iconfont icon-dituguanli"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                地图管理
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="3" class="arrow-panel-col ">
          <div class="arrow-right">
            <i class="iconfont icon-jiantou"></i>
          </div>
        </el-col>

        <el-col :span="6"  class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper orange">
              <i class="iconfont icon-tixingshixin"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                区域规划告警配置
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="3" class="arrow-panel-col">
          <div class="arrow-right">
            <i class="iconfont icon-jiantou"></i>
          </div>
        </el-col>

        <el-col :span="6"  class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper blue">
              <i class="iconfont icon-keshiguanli"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                科室管理
              </div>
            </div>
          </div>
        </el-col>

      </el-row>

      <el-row :gutter="40" class="panel-group">
        <el-col :span="9" class="arrow-panel-col"></el-col>
        <el-col :span="6" class="arrow-panel-col">
          <div>
            <i class="iconfont icon-jiantou"></i>
          </div>
        </el-col>
        <el-col :span="9" class="arrow-panel-col "></el-col>
      </el-row>

      <el-row :gutter="40" class="panel-group">
        <el-col :span="6"  class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper pink">
              <i class="iconfont icon-yisheng"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                医护人员患者信息
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="3" class="arrow-panel-col ">
          <div class="arrow-right">
            <i class="iconfont icon-jiantou"></i>
          </div>
        </el-col>

        <el-col :span="6"  class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <i class="iconfont icon-dituguanli"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                地图管理
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="3" class="arrow-panel-col">
          <div class="arrow-right">
            <i class="iconfont icon-jiantou"></i>
          </div>
        </el-col>

        <el-col :span="6"  class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <i class="iconfont icon-dituguanli"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                地图管理
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="40" class="panel-group">
        <el-col :span="9" class="arrow-panel-col"></el-col>
        <el-col :span="6" class="arrow-panel-col">
          <div>
            <i class="iconfont icon-jiantou"></i>
          </div>
        </el-col>
        <el-col :span="9" class="arrow-panel-col "></el-col>
      </el-row>

      <el-row :gutter="40" class="panel-group">
        <el-col :span="6"  class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <i class="iconfont icon-dituguanli"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                地图管理
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="3" class="arrow-panel-col ">
          <div class="arrow-right">
            <i class="iconfont icon-jiantou"></i>
          </div>
        </el-col>

        <el-col :span="6"  class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <i class="iconfont icon-dituguanli"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                地图管理
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="3" class="arrow-panel-col">
          <div class="arrow-right">
            <i class="iconfont icon-jiantou"></i>
          </div>
        </el-col>

        <el-col :span="6"  class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <i class="iconfont icon-dituguanli"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                地图管理
              </div>
            </div>
          </div>
        </el-col>

      </el-row>
      
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.home{
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 0px 32px;
  .home-container{
    
    .panel-group{

      .card-panel-col{
        
        height: 80px;

        .card-panel{
          height: 100%;
          background: #e2e4e2;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 20px;
          border-radius: 4px;

          .card-panel-icon-wrapper{
            width: 50px;
            height: 50px;
            border-radius:25px;

            &.green{
              background: #0f8104;
            }
            &.orange{
              background: orange;
            }
            &.blue{
              background: #94d6f0;
            }
            &.pink{
              background: #eac3ee;
            }
            

            i{
              font-size: 34px;
              color: #fff;
            }
          }

          .card-panel-description{
            margin-left: 20px;

            .card-panel-text{
              font-size: 20px;
              color: #313030;
            }
          }
        }
      }
      .arrow-panel-col{
        height: 80px;
        line-height: 80px;
        .arrow-right{
          transform: rotate(-90deg);
        }
        i{
            font-size: 38px;
            color: #94d6f0;
          }
      }
    }
  }
}
</style>
