<template>
  <div class="goods-comment" >
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{commentInfo.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            v-for="(item,i) in commentInfo.tags"
            :key="item.title"
            :class="{active: currentTagIndex === i}"
            href="javascript:;"
            @click="changeTag(i)"
            >{{item.title}}（{{item.tagCount}}）</a>
        </div>
      </div>
    </div>
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a href="javascript:;" :class="{active: reqParams.sortField === null}" @click="changeSort(null)">默认</a>
      <a href="javascript:;" :class="{active: reqParams.sortField === 'createTime'}"  @click="changeSort('createTime')">最新</a>
      <a href="javascript:;" :class="{active: reqParams.sortField === 'praiseCount'}" @click="changeSort('praiseCount')">最热</a>
    </div>
     <!-- 列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickName(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="i in item.score" :key="i+'s'" class="iconfont icon-wjx01"></i>
            <i v-for="i in (5-item.score)" :key="i+'k'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 评论图片组件 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures" />
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <XtxPagination :total="total" :pageSize="reqParams.pageSize" :current-page="reqParams.page" @current-change="changePagerFn" v-if="commentInfo"/>
  </div>
</template>
<script>
import { ref, inject, reactive, watch } from 'vue'
import { findGoodsCommentInfo, findGoodsCommentList } from '@/api/product'
import GoodsCommentImage from './goods-comment-image.vue'
export default {
  name: 'GoodsComment',
  components: {
    GoodsCommentImage
  },
  setup () {
    // 获取评价信息
    const commentInfo = ref(null) // 对于不知道获取的数据是什么类型统一用null
    const goods = inject('goods')
    findGoodsCommentInfo(goods.value.id).then(data => {
      // 给拿到的数据tabs数组追加 有图 全部评价 (加在最前面)
      data.result.tags.unshift({ title: '有图', tagCount: data.result.hasPictureCount, type: 'img' })
      data.result.tags.unshift({ title: '全部评价', tagCount: data.result.evaluateCount, type: 'all' })
      commentInfo.value = data.result
    })
    // 激活tag 默认激活全部评价
    const currentTagIndex = ref(0)
    // 点击tag修改激活
    const changeTag = (i) => {
      currentTagIndex.value = i
      // 点击tag修改筛选条件
      // 根据索引拿到tag
      const tag = commentInfo.value.tags[i]
      // 1.全部评价
      // 2.有图
      // 3.其他评价
      if (tag.type === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = true
        reqParams.tag = tag.title
      }
      // 点击修改筛选条件就重置page
      reqParams.page = 1
    }
    // 点击排序 既修改字段又重置页码
    const changeSort = (sortField) => {
      reqParams.sortField = sortField
      // 点击修改筛选条件就重置page
      reqParams.page = 1
    }

    // 准备筛选条件数据
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null // 排序字段 praiseCount createTime
      // sortMethod: null // 排序方法 asc desc
    })

    // 初始化发请求,筛选评论
    const commentList = ref([])
    const total = ref(0)
    // 监听reqParams变化重新发请求
    watch(reqParams, () => {
      // 页面重置为1 每次筛选条件变化时都应从第一页开始浏览
      // reqParams.page = 1 不建议放在watch里,因为本身监听的就是reqParams又在watch回调函数里修改reqParams不好 容易又触发一次watch 这里没触发因为本身设置的page值就是1 相当于没变
      findGoodsCommentList(goods.id, reqParams).then(data => {
        commentList.value = data.result.items
        total.value = data.result.counts
      })
    }, { immediate: true })

    // 定义转换数据的函数(对应vue2.0过滤器)
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, '').trim()
    }
    const formatNickName = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }

    // 实现分页切换
    const changePagerFn = (newPage) => {
      reqParams.page = newPage // 修改reqParams的page 就会自动触发watch发请求
    }
    return { commentInfo, currentTagIndex, reqParams, commentList, total, changeTag, changeSort, changePagerFn, formatSpecs, formatNickName }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }

}
</style>
