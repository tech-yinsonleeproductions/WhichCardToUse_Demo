// app/api/card-decision/route.js

export async function POST(req) {

  const { category } = await req.json(); // Get the category from the request body

  
  const getBestCard = (category) => {
    
    const cards = {
      CardA: {
        name: 'Visa Infinite',
        multipliers: {
          Dining: 5,
          ForeignCurrency: 10,
        },
        transferRate: 7.4
      },
      CardB: {
        name: 'World',
        multipliers: {
          EWalletTopup: 3,  
        },
        transferRate: 7.4
      },
      CardC: {
        name: 'Amex',
        multipliers: {
          Dining: 1 / 2.5,       
          ForeignCurrency: 0.5,  
          EWalletTopup: 0,       
          OnlineSpending: 0.5,   
        },
        transferRate: 1
      }
    };

    let bestCard = null;
    let maxPointsPerDollar = 0;

    // Loop through all the cards and calculate points per dollar based on the selected category
    for (const cardKey in cards) {
      const card = cards[cardKey];

      const multiplier = card.multipliers[category] ?? 1;  // Retrieve the multiplier for the selected category (fall back to '1' if not specified)

      if (multiplier === 0) continue; // Skip this card if the multiplier is 0 (no points for this category)

      const pointsPerDollar = multiplier / card.transferRate; // Calculate the points per dollar for each card based on the selected category

      // If the current card offers more points per dollar, update the bestCard
      if (pointsPerDollar > maxPointsPerDollar) {
        maxPointsPerDollar = pointsPerDollar;
        bestCard = card;
      }
    }

    return bestCard;
  };


  const bestCard = getBestCard(category);
  

  // Return the response based on whether we found the best card
  if (bestCard) {
    return new Response(
      JSON.stringify({
        bestCard: bestCard.name,
        multiplier: bestCard.multipliers[category] ?? 1, // Return the multiplier for the selected category, defaulting to 1
        transferRate: bestCard.transferRate,
      }),
      { status: 200 }
    );
  } else {
    return new Response(JSON.stringify({ error: 'Invalid category or no points for this category' }), { status: 400 });
  }
}
