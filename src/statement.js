function calculateVolumeCredits(perf, play) {
    let volumeCredits = 0;
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
    return volumeCredits;
}

function toUsd(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount / 100);
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

function calculateTotalVolumeCredits(invoice, plays) {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        volumeCredits += calculateVolumeCredits(perf, play);
    }
    return volumeCredits;
}

function createResult(data) {
    let result = `Statement for ${data.customerName}\n`;

    for (let playInfo of data.playInfos) {
        result += ` ${playInfo.name}: ${playInfo.amount} (${playInfo.audience} seats)\n`;
    }

    result += `Amount owed is ${data.totalAmounts}\n`;
    result += `You earned ${data.totalVolumeCredits} credits \n`;
    return result;
}

function generateData(invoice, plays) {
    let data = {};
    data.totalAmounts = toUsd(calculateTotalAmount(invoice, plays));
    data.totalVolumeCredits = calculateTotalVolumeCredits(invoice,plays);
    data.customerName = invoice.customer;
    data.performances = invoice.performances;
    data.playInfos = [];

    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = toUsd(calculateAmount(play, perf));
        data.playInfos.push({'amount': thisAmount, 'name': play.name,'audience':perf.audience});
    }
    return data;
}

function statement(invoice, plays) {
    return createResult(generateData(invoice, plays));
}

function createHtmlResult(data) {
    let result = `<h1>Statement for ${data.customerName}</h1>\n<table>\n<tr><th>play</th><th>seats</th><th>cost</th></tr>`;

    for (let playInfo of data.playInfos) {
        result += `<tr><td>${playInfo.name}</td><td>${playInfo.audience}</td><td>${playInfo.amount}</td></tr>\n`;
    }
    result += `</table>\n`
    result += `<p>Amount owed is <em>${data.totalAmounts}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
    return result;
}

function htmlStatement(invoice,plays){
    return createHtmlResult(generateData(invoice,plays));
}

function calculateAmount(play, perf) {
    let thisAmount = 0;
    switch (play.type) {
        case 'tragedy':
            thisAmount = 40000;
            if (perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;
        case 'comedy':
            thisAmount = 30000;
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
    htmlStatement,
};
