<template>
  <div class="home">
    <h2>定位信息管理流程</h2>
    <div class="home-container">

      <el-row :gutter="20" class="panel-group">

        <el-col :span="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper green">
              <i class="iconfont icon-dituguanli" />
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
            <i class="iconfont icon-jiantou" />
          </div>
        </el-col>

        <el-col :span="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper red">
              <i class="el-icon-warning" />
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
            <i class="iconfont icon-jiantou" />
          </div>
        </el-col>

        <el-col :span="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper sky">
              <i class="iconfont icon-keshiguanli" />
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
        <el-col :span="9" class="arrow-panel-col" />
        <el-col :span="6" class="arrow-panel-col">
          <div>
            <i class="iconfont icon-jiantou" />
          </div>
        </el-col>
        <el-col :span="9" class="arrow-panel-col " />
      </el-row>

      <el-row :gutter="40" class="panel-group">
        <el-col :span="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper pink">
              <i class="iconfont icon-yisheng" />
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
            <i class="iconfont icon-jiantou" />
          </div>
        </el-col>

        <el-col :span="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper orange">
              <i class="iconfont icon-biaoqian" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                标签下发
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="3" class="arrow-panel-col">
          <div class="arrow-right">
            <i class="iconfont icon-jiantou" />
          </div>
        </el-col>

        <el-col :span="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper blue">
              <i class="iconfont icon-shipin" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                视频监控
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="40" class="panel-group">
        <el-col :span="9" class="arrow-panel-col" />
        <el-col :span="6" class="arrow-panel-col">
          <div>
            <i class="iconfont icon-jiantou" />
          </div>
        </el-col>
        <el-col :span="9" class="arrow-panel-col " />
      </el-row>

      <el-row :gutter="40" class="panel-group">
        <el-col :span="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper purple">
              <i class="iconfont icon-lishijilu" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                历史记录
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="3" class="arrow-panel-col ">
          <div class="arrow-right">
            <i class="iconfont icon-jiantou" />
          </div>
        </el-col>

        <el-col :span="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper sea">
              <i class="iconfont icon-jiankongzhongxin" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                实时监控
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="3" class="arrow-panel-col">
          <div class="arrow-right">
            <i class="iconfont icon-jiantou" />
          </div>
        </el-col>

        <el-col :span="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper grass">
              <i class="iconfont icon-yundanguiji" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                轨迹回放
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

  .home-container{
    margin: 80px 60px;

    .panel-group{

      .card-panel-col{

        height: 80px;

        .card-panel{
          height: 100%;
          background: #deebf9;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 20px;
          border-radius: 4px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;

          .card-panel-icon-wrapper{

            border-radius:50%;
            padding: 6px;

            &.green{
              background: #0f8104;
            }
            &.red{
              background: #ec6d46;
            }
            &.sky{
              background: #94d6f0;
            }
            &.orange{
              background: orange;
            }
            &.blue{
              background: blue;
            }
            &.pink{
              background: #eac3ee;
            }
            &.purple{
              background: purple;
            }
            &.sea{
              background: #0d02a8;
            }
            &.grass{
              background: #0b4e05;
            }

            i{
              font-size: 34px;
              color: #fff;
            }
          }

          .card-panel-description{
            margin-left: 20px;
            min-width: 90px;

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
