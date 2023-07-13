<template>
  <div class="container">
    <div class="inner">
      <div class="box">
        <div class="prize" v-if="state.isPrize">
          <div class="big">恭喜您中奖了</div>
          <div>{{state.currentPrize.name}}1台</div>
        </div>
        <ul v-show="!state.isPrize">
          <li v-for="(item, index) in state.prizes" :key="item.name" :class="{active: state.currentIndex === index}">
            {{ item.name }}
            <img :src="item.url" />
            {{ item.num }}台
          </li>
        </ul>
      </div>
      <div class="footer" v-if="state.isPrize">
        <div class="btn" @click="state.isPrize=false">返回</div>
      </div>
      <div class="footer" v-else>
        <div class="btn" @click="start" :class="{disabled}">开始</div>
        <div class="btn" @click="stop" :class="{disabled: state.isStop}">停下</div>
      </div>
    </div>
    <audio :src="require('@/assets/runing.mp3')" loop></audio>
  </div>
</template>

<script type="jsx">
import { reactive, computed } from 'vue';
import { getPrize } from './lucky';
import bolang from './assets/img/bolang.png'
import neck from './assets/img/neck.png'
import air from './assets/img/air.png'
import coffee from './assets/img/coffee.png'
import ye_can from './assets/img/ye_can.png'


const getDefaultPrizes = () => [
  {num: 13, name: '博朗剃须刀', url: bolang},
  {num: 9, name: '锐舞挂脖空调', url: neck},
  {num: 10, name: 'blueair空气净化器', url: air},
  {num: 9, name: '德龙咖啡机', url: coffee},
  {num: 11, name: '步林野营炊具套餐', url: ye_can}
]

export default {
  name: 'App',
  setup() {
    function getPerizes() {
      const prizes = localStorage.getItem('prizes')
      if (prizes) {
        return JSON.parse(prizes)
      } else {
        return getDefaultPrizes()
        // return [
        //   {num: 2, name: '博朗剃须刀', url: require('@/assets/img/bolang.png')},
        //   {num: 1, name: '锐舞挂脖空调', url: require('@/assets/img/neck.png')},
        //   {num: 1, name: 'blueair空气净化器', url: require('@/assets/img/air.png')},
        //   {num: 1, name: '德龙咖啡机', url: require('@/assets/img/coffee.png')},
        //   {num: 2, name: '步林野营炊具套餐', url: require('@/assets/img/ye_can.png')}
        // ]
      }
    }

    const state = reactive({
      prizes: getPerizes(),
      currentIndex: -1,
      currentPrize: {
        index: -1,
        name: ''
      },
      isRun: false,
      isPrize: false,
      isStop: true
    })

    const disabled = computed(() => {
      const total = state.prizes.reduce((total, current) => {
        return total += current.num
      }, 0)
      return state.isRun || total <= 0
    })

    // setInterval(() => {
    
    // }, 100)

    let times = 260
    function run() {
      state.isRun = true
      if (state.isStop) {
        times += 50
      } else {
        if (times > 50) times-= 20
      }
      setTimeout(() => {
        let index = state.currentIndex + 1
        state.currentIndex = index % 5
        setPlayRate(times)
        if (times < 360) {
          run()
        } else {
          const {index} = state.currentPrize
          // 如果当前选择index，不等于中奖的index。继续执行下一次，直到和中奖index相等
          if (state.currentIndex !== index) {
            run()
          } else {
            setPrizes()
          }
        }
      }, times)
    }

    function start() {
      if (disabled.value) return false
      document.querySelector('audio').play()
      state.isStop = false
      times = 260
      state.currentPrize = {
        index: -1,
        name: ''
      }
      run()
    }

    function setPlayRate(times) {
      let playbackRate = 1
      if (times > 50) {
        playbackRate = 50 / times
      }
      document.querySelector('audio').playbackRate = playbackRate
    }

    function setPrizes() {
      document.querySelector('audio').pause()
      setTimeout(() => {
        const {index} = state.currentPrize
        state.prizes[index].num--
        localStorage.setItem('prizes', JSON.stringify(state.prizes))
        state.isRun = false
        state.isPrize = true
      }, 1000)
    }

    function stop() {
      if (state.isStop) return false
      const {index, prize} = getPrize(state.prizes)
      state.currentPrize = {
        index,
        name: prize.name
      }
      state.isStop = true
    }

    window.addEventListener('keyup', e => {
      if (e.code === 'Enter' && e.ctrlKey) {
        var name=prompt("请在下方对话框中输入“城云科技”，进行重置奖品数量。")
        if (name === '城云科技') {
          localStorage.removeItem('prizes')
          state.prizes = getDefaultPrizes()
        }
      }
    })

    return {
      state,
      getPrize,
      disabled,
      start,
      stop
    }
   
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
li{
  list-style: none;
}
html, body{
  height: 100%;
}
#app {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container{
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/bg.jpg') no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.inner{
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding-top: 380rpx; */
}
.box{
  width: 4560rpx;
  height: 1290rpx;
  background: url('~@/assets/img/box.png') no-repeat;
  background-size: 100% 100%;
}
.footer{
  display: flex;
}
.btn{
  width:605rpx;
  height:184rpx;
  background: url('~@/assets/img/btn.png') no-repeat;
  background-size: 100% 100%;
  font-size: 96rpx;
  text-align: center;
  font-weight: bold;
  color: #ff1e06;
  line-height: 164rpx;
  text-shadow: 1px 1px 0 #fff;
  margin: 0 25rpx;
  cursor: pointer;
  user-select: none;
}
.disabled{
  opacity: 0.6;
  cursor: no-drop;
}
ul{
  display: flex;
  justify-content: space-between;
  width: 3600rpx;
  margin: 300rpx 0 0 480rpx;
}
li{
  width: 660rpx;
  height: 760rpx;
  background: #feeacf;
  color: #ef4f01;
  line-height: 160rpx;
  font-size: 70rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
li.active{
  background: #fe0000;
  color: #fff;
}
li img{
  width: 580rpx;
  height: 470rpx;
}
.prize{
  color: #ec4a01;
  font-size: 260rpx;
  font-weight: bold;
  height: 440rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 105%;
  letter-spacing: 40rpx;
}
.big{
  font-size: 310rpx;
}
</style>
