
/**
 * Utility functions for fetching cryptocurrency data from CoinGecko API
 */

// Direct API interfaces for CoinGecko
export interface ChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

/**
 * Fetches historical chart data from CoinGecko
 * @param id Cryptocurrency ID
 * @param days Number of days to fetch data for
 * @returns Promise with chart data
 */
export const fetchCoinGeckoChart = async (id: string, days: number): Promise<ChartData> => {
  // Add cache busting to avoid rate limiting issues
  const cacheBuster = `_cb=${Date.now()}`;
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&${cacheBuster}`
  );
  
  if (!response.ok) {
    throw new Error(`CoinGecko API Error: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Fetches current price data from CoinGecko
 * @param id Cryptocurrency ID
 * @returns Promise with current price as a number
 */
export const fetchCurrentPrice = async (id: string): Promise<number> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
  );
  
  if (!response.ok) {
    throw new Error(`CoinGecko API Error: ${response.status}`);
  }
  
  const data = await response.json();
  // Ensure we're returning a number and not undefined or other types
  const price = data[id]?.usd;
  return typeof price === 'number' ? price : 0;
};
