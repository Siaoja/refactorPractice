function calculateVolumeCredits(perf, play) {
  let volumeCredits = 0;
  // add volume credits  计算返还客户的积分
  volumeCredits += Math.max(perf.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  //格式化金钱转为美元
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
  //遍历所有的剧场剧目
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play,perf);
    volumeCredits += calculateVolumeCredits(perf, play);
    //print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

function calculateAmount(play,perf){
  let thisAmount = 0;
  switch (play.type) {
      //悲剧的收费
    case 'tragedy':
      thisAmount = 40000;
      //如果观众人数多于30人，加收费用
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
      //喜剧收费
    case 'comedy':
      thisAmount = 30000;
      //如果观众多于20人，加收费用
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}



module.exports = {
  statement,
};
