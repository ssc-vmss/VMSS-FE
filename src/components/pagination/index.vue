<template>
  <div class="pagination-view">
    <div v-show="show" class="pagination-container">
      <div class="pagination-outline">
        <ul class="pagination-ul">
          <li v-show="current_page>1" class="jump" @click="jumpPage(current_page-1)">
            <button>上页</button>
          </li>
          <li v-show="current_page>4&&pages>7" class="jump" @click="jumpPage(1)">
            <button>1</button>
          </li>
          <li v-show="efont" class="ellipsis">
            <button>...</button>
          </li>
          <li v-for="num in indexs" :key="num" class="jump" @click="jumpPage(num)">
            <button :class="{bgprimary:current_page==num}">{{ num }}</button>
          </li>
          <li v-show="current_page<pages-3&&pages>7" class="ellipsis">
            <button>...</button>
          </li>
          <li v-show="current_page<pages-3&&pages>7" class="jump" @click="jumpPage(pages)">
            <button>{{ pages }}</button>
          </li>
          <li v-show="current_page<pages" class="jump" @click="jumpPage(current_page+1)">
            <button>下页</button>
          </li>
          <li class="jumppoint">
            <button>跳转</button>
          </li>
          <li class="jumpinp">
            <input v-model="changePage" type="text" />
          </li>
          <li class="jump gobtn" @click="jumpPage(changePage)">
            <button>GO</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageSize: Number,
    currentPage: Number,
    total: Number
  },
  data() {
    return {
      page_size: this.pageSize, // 每页条数
      current_page: this.currentPage, // 当前页
      pages: 0, // 根据每页条数和总页数算出的页数
      totalNumber: this.total, // 总条数
      changePage: '' // 跳转页
    }
  },
  computed: {
    // 只有一页时不显示分页
    show() {
      return this.pages && this.pages !== 1
    },
    efont() {
      if (this.pages <= 7) return false
      return this.current_page > 4
    },
    indexs() {
      let left = 1, right = this.pages, ar = []
      if (this.pages >= 8) {
        if (this.current_page > 4 && this.current_page < this.pages - 3) {
          left = Number(this.current_page) - 2
          right = Number(this.current_page) + 2
        } else {
          if (this.current_page <= 4) {
            left = 1
            right = 5
          } else {
            right = this.pages
            left = this.pages - 5
          }
        }
      }
      while (left <= right) {
        ar.push(left)
        left++
      }
      return ar
    }
  },
  created() {
    this.getPages()
  },
  methods: {
    getPages() {
      if (this.total === undefined) {
        this.pages = 1
      }
      this.pages = this.totalNumber % this.page_size === 0 ? this.totalNumber / this.page_size : Math.floor(this.totalNumber / this.page_size) + 1
    },
    jumpPage(id) {
      this.current_page = id
      this.$emit('handleJumpPage', this.current_page)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-view{
  padding: 10px;
}
.pagination-outline {
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    white 17%,
    white 83%,
    rgba(255, 255, 255, 0) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#00ffffff',GradientType=1 );
  height: 40px;
  left: 50%;
  position: relative;
  text-align: center;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 100%;
  top: 20px;
}
.pagination-outline:before,
.pagination-outline:after {
  background: linear-gradient(
    to right,
    rgba(0, 128, 128, 0) 0%,
    rgba(0, 128, 128, 0.3) 17%,
    rgba(0, 128, 128, 0.3) 83%,
    rgba(0, 128, 128, 0) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#00000000',GradientType=1 );
  content: '';
  height: 1px;
  left: 0;
  position: absolute;
  width: 100%;
}
.pagination-outline:before {
  top: -1px;
}
.pagination-outline:after {
  bottom: -1px;
}
.pagination-ul {
  display: inline-block;
  list-style: none;
  margin: 5px 0;
}
.pagination-ul li {
  float: left;
}
.pagination-ul button {
  background: none;
  border: none;
  border-radius: 50%;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.6);
  display: block;
  font-size: 16px;
  height: 30px;
  line-height: 30px;
  min-width: 30px;
  padding: 0;
  outline: none;
  position: relative;
  transition: all 170ms linear;
  margin: 0 5px;
}
.pagination-ul button:before {
  background: rgba(0, 128, 128, 0.2);
  border-radius: 50%;
  content: '';
  cursor: pointer;
  height: 0;
  left: 50%;
  opacity: 0;
  position: absolute;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  transition: all 170ms linear;
  top: 50%;
  width: 0;
}
@-webkit-keyframes hoverAnimation {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes hoverAnimation {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.pagination-ul button:hover:not(.bgprimary):before {
  -webkit-animation: hoverAnimation 510ms linear forwards;
  animation: hoverAnimation 510ms linear forwards;
  height: 30px;
  width: 30px;
}
.pagination-ul .bgprimary {
  background: rgba(0, 128, 128, 0.2);
  color: black;
}
.jumpinp input {
  width: 30px;
  height: 30px;
  font-size: 16px;
  border: 1px solid #ccc;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  text-align: center;
  outline-style: none;
}
.jumpinp input:focus {
  border-color: rgba(0, 128, 128, 0.7);
}
.jumppoint {
  margin-left: 30px;
}
</style>
