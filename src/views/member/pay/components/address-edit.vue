<template>
  <XtxDialog :title="`${formData.id ? '修改':'添加'}收货地址`" v-model:visible="visibleDialog">
    <!-- 表单 -->
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity :fullLocation="formData.fullLocation" @change="changeCity" placeholder="请选择所在地区"/>
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
          </div>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <template #footer>
      <XtxButton @click="visibleDialog = false" type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton @click="submit" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>

<script>
import { ref, reactive } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/message.js'
export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    const visibleDialog = ref(false)

    // 定义一个open方法 这样父组件可以调用组件实例open方法打开对话框
    const open = (address) => {
      if (address.id) {
        // 如果修改 填充表单
        for (const key in formData) {
          formData[key] = address[key]
        }
      } else {
        // 如果添加操作 需要清空表单
        for (const key in formData) {
          if (key === 'isDefault') {
            formData[key] = 1
          } else {
            formData[key] = null
          }
        }
      }
      visibleDialog.value = true
    }

    // 定义表单数据对象
    const formData = reactive({
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 0,
      // 城市组件的完整字段
      fullLocation: ''
    })

    // 修改表单城市数据 其他字段都是双向绑定的
    const changeCity = (data) => {
      formData.provinceCode = data.provinceCode
      formData.cityCode = data.cityCode
      formData.countyCode = data.countyCode
      formData.fullLocation = data.fullLocation
    }

    // 添加或修改的提交操作
    const submit = () => {
      if (formData.id) {
        // 修改
        editAddress(formData).then(() => {
          // 提示
          Message({ type: 'success', text: '修改收货地址成功' })
          // 关闭
          visibleDialog.value = false
          // 通知父组件更新数据
          emit('on-success', formData)
        })
      } else {
        // 添加
        // 1.省略了校验
      // 2.发送请求
        addAddress(formData).then(data => {
          formData.id = data.result.id
          // 提示
          Message({ type: 'success', text: '添加收货地址成功' })
          // 关闭
          visibleDialog.value = false
          // 通知父组件更新数据
          emit('on-success', formData)
        })
      }
    }
    return { visibleDialog, formData, open, changeCity, submit }
  }
}
</script>

<style scoped lang="less">
.address-edit {
  .xtx-dialog {
  :deep(.wrapper){
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
}
</style>
