// app/api/card-decision/route.js

export async function POST(req) {
  const { category } = await req.json(); // Get the category from the request body

  const cards = {
    CardA: {
      name: 'Visa Infinite',
      diningMultiplier: 5, // Dining: 5x
      foreignCurrencyMultiplier: 10, // Foreign currency: 10x
      otherMultiplier: 1, // Other categories: 1x
      transferRate: 7.4,  // Transfer rate for Card A
    },
    CardB: {
      name: 'World',
      eWalletTopupMultiplier: 3, // E-Wallet topup: 3x
      otherMultiplier: 1, // Other categories: 1x
      transferRate: 1,  // Transfer rate for Card B
    },
    CardC: {
      name: 'Amex',
      onlineSpendingMultiplier: 0.5, // Online: 0.5x
      singaporeAirlinesMultiplier: 1, // Singapore Airlines: 1x
      foreignCurrencyMultiplier: 0.5, // Foreign currency: 0.5x
      otherMultiplier: 1 / 2.5, // Other categories: 1/2.5x
      transferRate: 1, // Transfer rate for Card C
    }
  };

  const getBestCard = (category) => {
    let bestCard = null;
    let maxPointsPerDollar = 0;

    // Logic to select the best card based on the category
    if (category === 'Dining') {
      bestCard = (cards.CardA.diningMultiplier / cards.CardA.transferRate) > maxPointsPerDollar ? cards.CardA : bestCard;
    } else if (category === 'ForeignCurrency') {
      bestCard = (cards.CardA.foreignCurrencyMultiplier / cards.CardA.transferRate) > maxPointsPerDollar ? cards.CardA : bestCard;
      bestCard = (cards.CardB.foreignCurrencyMultiplier / cards.CardB.transferRate) > maxPointsPerDollar ? cards.CardB : bestCard;
      bestCard = (cards.CardC.foreignCurrencyMultiplier / cards.CardC.transferRate) > maxPointsPerDollar ? cards.CardC : bestCard;
    } else if (category === 'EWalletTopup') {
      bestCard = (cards.CardB.eWalletTopupMultiplier / cards.CardB.transferRate) > maxPointsPerDollar ? cards.CardB : bestCard;
    } else if (category === 'OnlineSpending') {
      bestCard = (cards.CardC.onlineSpendingMultiplier / cards.CardC.transferRate) > maxPointsPerDollar ? cards.CardC : bestCard;
    } else {
      bestCard = (cards.CardA.otherMultiplier / cards.CardA.transferRate) > maxPointsPerDollar ? cards.CardA : bestCard;
      bestCard = (cards.CardB.otherMultiplier / cards.CardB.transferRate) > maxPointsPerDollar ? cards.CardB : bestCard;
      bestCard = (cards.CardC.otherMultiplier / cards.CardC.transferRate) > maxPointsPerDollar ? cards.CardC : bestCard;
    }

    return bestCard;
  };

  const bestCard = getBestCard(category);

  if (bestCard) {
    return new Response(JSON.stringify({
      bestCard: bestCard.name,
      multiplier: bestCard.diningMultiplier || bestCard.foreignCurrencyMultiplier || bestCard.otherMultiplier,
      transferRate: bestCard.transferRate,
    }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Invalid category' }), { status: 400 });
  }
}
