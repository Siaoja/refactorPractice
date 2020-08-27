function calculateVolumeCredits(perf, play) {
  let volumeCredits = 0;
  // add volume credits  计算返还客户的积分
  volumeCredits += Math.max(perf.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

function toUsd(amount) {
  return  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount/100);
}

function calculateTotalAmount(invoice, plays) {
  let totalAmount = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play, perf);
    totalAmount += thisAmount;
  }
  return totalAmount;
}

function calculateTotalVolumeCredits(invoice,plays){
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    volumeCredits += calculateVolumeCredits(perf, play);
  }
  return volumeCredits;
}

function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits;
  let result = `Statement for ${invoice.customer}\n`;


  totalAmount = calculateTotalAmount(invoice, plays, totalAmount);
  volumeCredits = calculateTotalVolumeCredits(invoice,plays);

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play, perf);
    //print line for this order
    result += ` ${play.name}: ${toUsd(thisAmount)} (${perf.audience} seats)\n`;
  }


  result += `Amount owed is ${toUsd(totalAmount)}\n`;
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
