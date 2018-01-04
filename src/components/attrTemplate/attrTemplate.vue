<template>
  <div class="attrTemplate">
    <template v-for="item in attrList">
      <template v-if="item.attrType == attrType">
        <div class="item">
          <span class="text">{{ item.attrCnName }}：</span>
          <template v-if="!item.dictDataObject">
            <el-input v-model="test" size="small" :placeholder="'请填写' + item.attrCnName"></el-input>
          </template>
          <template v-else>
            <template v-if="item.dataType == 10 || item.dataType == 20">
              <el-select
                v-model="test"
                size="small"
                style="width:100%"
                :placeholder="'请填写' + item.attrCnName">
                <el-option
                  v-for="child in item.dictDataObject"
                  :key="child.text"
                  :label="child.text"
                  :value="child.value">
                </el-option>
              </el-select>
            </template>
            <template v-else-if="item.dataType == 30 || item.dataType == 40">
              <el-select
                v-model="test"
                size="small"
                style="width:100%"
                multiple
                filterable
                allow-create
                default-first-option
                :placeholder="'请选择' + item.attrCnName">
                <el-option
                  v-for="child in item.dictDataObject"
                  :key="child.text"
                  :label="child.text"
                  :value="child.value">
                </el-option>
              </el-select>
            </template>
          </template>
          <span class="pointer" v-show="item.isRequired == 1">*</span>
        </div>
      </template>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    attrList: {
      type: Array,
      default() {
        return []
      }
    },
    attrType: {
      type: Number
    }
  },
  data() {
    return {
      test: ''
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
