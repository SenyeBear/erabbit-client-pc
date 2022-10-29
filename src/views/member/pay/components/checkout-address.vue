<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3}\d{4}(\d{4}))/, '$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation.replace(/ /g,'')+showAddress.address}}</li>
      </ul>
      <a @click="openAddressEdit(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
  </div>
    <!-- 切换收货地址组件 -->
  <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
    <!-- 收货地址列表 -->
    <div @click="selectedAddress = item" :class="{active: selectedAddress && selectedAddress.id === item.id}" class="text item" v-for="item in list" :key="item.id">
      <ul>
        <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
        <li><span>联系方式：</span>{{item.contact.replace(/^(\d{3}\d{4}(\d{4}))/, '$1****$2')}}</li>
        <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
      </ul>
    </div>
    <template v-slot:footer>
      <XtxButton @click="visibleDialog = false"  type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton @click="confirm" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 收货地址添加编辑组件 -->
  <AddressEdit @on-success="successHandler" ref="addressEditCom" />
</template>
<script>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'

export default {
  name: 'CheckoutAddress',
  components: { AddressEdit },
  props: {
    // 收货地址列表
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    // 1.找默认收货地址
    // 2.没有默认地址 找第一条收货地址
    // 3.没有数据 提示添加
    const showAddress = ref(null)
    const defaultAddress = props.list.find(item => item.isDefault === 0)
    if (defaultAddress) {
      showAddress.value = defaultAddress
    } else {
      if (props.list.length) {
        // 代码风格警告， 不能把props数据赋值给响应式数据 原则上建议props数据通过计算属性使用改值 props.list[0]和showAddress.value共享同一个地址 今后修改showAdrress也会影响list[0]
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
    }

    // 默认通知父组件一个收货地址id
    emit('change', showAddress.value && showAddress.value.id)

    // 切换地址的对话框显示隐藏
    const visibleDialog = ref(false)

    // 记录用户当前选中的地址id/对象 方便后面取值显示
    const selectedAddress = ref(null)
    // 点击确认按钮时 显示地址换成选中地址 选中的地址id通知结算组件
    const confirm = () => {
      showAddress.value = selectedAddress.value
      emit('change', selectedAddress.value.id)
      visibleDialog.value = false
    }

    // 打开对话框
    const openDialog = () => {
      // 之前的数据置空
      selectedAddress.value = null
      visibleDialog.value = true
    }

    // 打开添加编辑收货地址组件
    const addressEditCom = ref(null)
    const openAddressEdit = (address) => {
      addressEditCom.value.open(address)
    }

    // 添加修改收货地址
    const successHandler = (formData) => {
      // 根据原来的list里有无该条id判断修改还是新增
      const editAddress = props.list.find(item => item.id === formData.id)
      if (editAddress) {
        // 修改操作
        for (const key in editAddress) {
          editAddress[key] = formData[key] // 新值覆盖旧值
        }
      } else {
        // 添加操作
      // props数据响应式不能直接改，但props.list是复杂数据类型所以可以改
      // 由于formDate和list引用地址相同 修改formData就会改变list里面地址的值 因此需要拷贝formData数据
        const jsonStr = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(jsonStr))
      }
    }
    return { showAddress, visibleDialog, selectedAddress, addressEditCom, confirm, openDialog, openAddressEdit, successHandler }
  }
}
</script>

<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
