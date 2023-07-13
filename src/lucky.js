// 抽奖思想，把所有奖品打平，一条直线一个个排在桌面上。每次随机取一个比奖品总数小的号。获取到奖品
function getNum(prizes) {
  const total = prizes.reduce((total, current) => {
    return total += current.num
  }, 0)

  // 随机生成一个 1 -> total 之间的数
  return Math.floor(Math.random() * total + 1)
}

// 判断这个随机数在哪个奖品区间
export function getPrize(prizes) {
  const num = getNum(prizes)
  let _total = 0,
      prize,
      index
  for (let i=0,len=prizes.length; i < len; i++) {
    const item = prizes[i]
    if (num >= _total && num <= item.num + _total) {
      prize = item
      index = i
      break
    } else {
      _total += item.num
    }
  }
  return { prize, index }
}