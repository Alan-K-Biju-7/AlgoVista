export const stockProfitTracer = {
  defaultInput: { prices: [7, 1, 5, 3, 6, 4] },
  runner(__args__, __log__) {
    const { prices } = __args__;
    let minPrice = Infinity, maxProfit = 0;
    __log__({ line: 0, message: 'Start: track minimum price and maximum profit seen so far.', vars: { minPrice: '∞', maxProfit: 0 }, structure: { type: 'array', label: 'prices', items: prices.map((v,i) => ({ idx: i, val: v, role: null })) } });

    for (let i = 0; i < prices.length; i++) {
      const p = prices[i];
      const profit = p - minPrice;
      const isNewMin = p < minPrice;
      if (isNewMin) minPrice = p;
      if (profit > maxProfit) maxProfit = profit;
      __log__({
        line: 3,
        message: 'Day ' + i + ': price=' + p + (isNewMin ? ' → new minimum!' : '') + ' | profit if sell today=' + (minPrice === Infinity ? 'N/A' : profit) + ' | maxProfit=' + maxProfit,
        vars: { day: i, price: p, minPrice, profit: minPrice === Infinity ? 'N/A' : profit, maxProfit },
        structure: { type: 'array', label: 'prices', items: prices.map((v, j) => ({ idx: j, val: v, role: j === i ? (isNewMin ? 'min' : 'current') : j < i && prices[j] === minPrice ? 'min' : null })) },
      });
    }
    __log__({ line: 7, message: 'Done. Maximum profit = ' + maxProfit, vars: { result: maxProfit }, structure: { type: 'array', label: 'prices', items: prices.map((v,i) => ({ idx: i, val: v, role: null })) } });
  },
};
