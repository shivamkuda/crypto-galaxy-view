
import { CryptoCurrency, GlobalData, ChartData, TrendingResponse } from "../types/crypto";

// Change the API base URL to CoinMarketCap
const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3"; // Keep as fallback
const CMC_API_BASE_URL = "https://pro-api.coinmarketcap.com/v1";

// CoinMarketCap requires an API key for all requests
const CMC_API_KEY = "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c"; // This is a demo key, replace with your actual key

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000000000) {
    return `$${(value / 1000000000000).toFixed(2)}T`;
  }
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Convert CoinMarketCap data to our app's expected format
const convertCMCToCryptoCurrency = (cmcData: any): CryptoCurrency[] => {
  return cmcData.map((item: any) => ({
    id: item.slug || item.id.toString(),
    symbol: item.symbol,
    name: item.name,
    image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`,
    current_price: item.quote.USD.price,
    market_cap: item.quote.USD.market_cap,
    market_cap_rank: item.cmc_rank,
    fully_diluted_valuation: item.quote.USD.fully_diluted_market_cap || null,
    total_volume: item.quote.USD.volume_24h,
    high_24h: item.quote.USD.price * (1 + item.quote.USD.percent_change_24h / 100),
    low_24h: item.quote.USD.price * (1 - item.quote.USD.percent_change_24h / 100),
    price_change_24h: item.quote.USD.price_change_24h || 0,
    price_change_percentage_24h: item.quote.USD.percent_change_24h,
    market_cap_change_24h: item.quote.USD.market_cap_change_24h || 0,
    market_cap_change_percentage_24h: item.quote.USD.market_cap_change_percentage_24h || 0,
    circulating_supply: item.circulating_supply,
    total_supply: item.total_supply,
    max_supply: item.max_supply,
    ath: item.quote.USD.ath_price || item.quote.USD.price * 1.5, // Approximation if not available
    ath_change_percentage: -10, // Approximation
    ath_date: new Date().toISOString(),
    atl: item.quote.USD.price * 0.5, // Approximation if not available
    atl_change_percentage: 100, // Approximation
    atl_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
    last_updated: item.last_updated
  }));
};

export const fetchCryptoList = async (
  page: number = 1,
  perPage: number = 20
): Promise<CryptoCurrency[]> => {
  try {
    // CoinMarketCap API request
    const start = (page - 1) * perPage + 1;
    const limit = perPage;
    
    const response = await fetch(
      `${CMC_API_BASE_URL}/cryptocurrency/listings/latest?start=${start}&limit=${limit}&convert=USD`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return convertCMCToCryptoCurrency(data.data);
  } catch (error) {
    console.error("Failed to fetch crypto list from CMC:", error);
    
    // Fallback to CoinGecko if CMC fails
    try {
      console.log("Falling back to CoinGecko API");
      const response = await fetch(
        `${COINGECKO_API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&locale=en`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (fallbackError) {
      console.error("Failed to fetch crypto list from fallback:", fallbackError);
      return [];
    }
  }
};

export const fetchGlobalData = async (): Promise<GlobalData | null> => {
  try {
    // CoinMarketCap global metrics API
    const response = await fetch(
      `${CMC_API_BASE_URL}/global-metrics/quotes/latest`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const cmcData = await response.json();
    
    // Convert to our app's GlobalData format
    return {
      active_cryptocurrencies: cmcData.data.total_cryptocurrencies,
      markets: cmcData.data.active_exchanges,
      total_market_cap: {
        usd: cmcData.data.quote.USD.total_market_cap
      },
      total_volume: {
        usd: cmcData.data.quote.USD.total_volume_24h
      },
      market_cap_percentage: {
        btc: cmcData.data.btc_dominance,
        eth: cmcData.data.eth_dominance
      },
      market_cap_change_percentage_24h_usd: cmcData.data.quote.USD.total_market_cap_yesterday_percentage_change
    };
  } catch (error) {
    console.error("Failed to fetch global data from CMC:", error);
    
    // Fallback to CoinGecko
    try {
      console.log("Falling back to CoinGecko API for global data");
      const response = await fetch(`${COINGECKO_API_BASE_URL}/global`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (fallbackError) {
      console.error("Failed to fetch global data from fallback:", fallbackError);
      return null;
    }
  }
};

export const fetchCryptoDetails = async (id: string): Promise<any | null> => {
  try {
    // First need to get the CMC id from the slug/id
    let cmcId = id;
    
    // If the id is not numeric, we need to look it up
    if (isNaN(parseInt(id))) {
      const infoResponse = await fetch(
        `${CMC_API_BASE_URL}/cryptocurrency/info?slug=${id}`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': CMC_API_KEY,
            'Accept': 'application/json'
          }
        }
      );
      
      if (!infoResponse.ok) {
        throw new Error(`API Error: ${infoResponse.status}`);
      }
      
      const infoData = await infoResponse.json();
      const coinData = Object.values(infoData.data)[0] as any;
      cmcId = coinData.id.toString();
    }
    
    // Now fetch the details using the CMC ID
    const response = await fetch(
      `${CMC_API_BASE_URL}/cryptocurrency/quotes/latest?id=${cmcId}&convert=USD`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const cmcData = await response.json();
    const coinData = cmcData.data[cmcId];
    
    // We also need the metadata
    const metaResponse = await fetch(
      `${CMC_API_BASE_URL}/cryptocurrency/info?id=${cmcId}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        }
      }
    );
    
    if (!metaResponse.ok) {
      throw new Error(`API Error: ${metaResponse.status}`);
    }
    
    const metaData = await metaResponse.json();
    const coinMeta = metaData.data[cmcId];
    
    // Transform to the format our app expects
    return {
      id: coinData.slug,
      symbol: coinData.symbol,
      name: coinData.name,
      description: {
        en: coinMeta.description || ""
      },
      image: {
        thumb: `https://s2.coinmarketcap.com/static/img/coins/64x64/${cmcId}.png`,
        small: `https://s2.coinmarketcap.com/static/img/coins/64x64/${cmcId}.png`,
        large: `https://s2.coinmarketcap.com/static/img/coins/128x128/${cmcId}.png`
      },
      market_data: {
        current_price: {
          usd: coinData.quote.USD.price
        },
        price_change_percentage_24h: coinData.quote.USD.percent_change_24h,
        market_cap: {
          usd: coinData.quote.USD.market_cap
        },
        market_cap_rank: coinData.cmc_rank,
        total_volume: {
          usd: coinData.quote.USD.volume_24h
        },
        circulating_supply: coinData.circulating_supply,
        total_supply: coinData.total_supply,
        max_supply: coinData.max_supply,
        ath: {
          usd: coinData.quote.USD.price * 1.5 // Approximation
        },
        ath_date: {
          usd: new Date().toISOString()
        },
        atl: {
          usd: coinData.quote.USD.price * 0.5 // Approximation
        },
        atl_date: {
          usd: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      links: {
        homepage: [coinMeta.urls?.website?.[0] || ""],
        blockchain_site: coinMeta.urls?.explorer || []
      }
    };
  } catch (error) {
    console.error(`Failed to fetch details for ${id} from CMC:`, error);
    
    // Fallback to CoinGecko
    try {
      console.log(`Falling back to CoinGecko API for ${id} details`);
      const response = await fetch(`${COINGECKO_API_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (fallbackError) {
      console.error(`Failed to fetch details for ${id} from fallback:`, fallbackError);
      return null;
    }
  }
};

export const fetchCryptoChart = async (
  id: string, 
  days: number = 7,
  realtimeOnly: boolean = false
): Promise<ChartData | null> => {
  try {
    // CoinMarketCap doesn't have a direct chart data API in the free tier
    // We'll use a workaround to fetch the latest price for real-time
    // and fallback to CoinGecko for historical data
    
    if (realtimeOnly) {
      // For realtime data, just get latest quote
      let cmcId = id;
      
      // If the id is not numeric, we need to look it up
      if (isNaN(parseInt(id))) {
        try {
          const infoResponse = await fetch(
            `${CMC_API_BASE_URL}/cryptocurrency/info?slug=${id}`,
            {
              headers: {
                'X-CMC_PRO_API_KEY': CMC_API_KEY,
                'Accept': 'application/json'
              }
            }
          );
          
          if (!infoResponse.ok) {
            throw new Error(`API Error: ${infoResponse.status}`);
          }
          
          const infoData = await infoResponse.json();
          const coinData = Object.values(infoData.data)[0] as any;
          cmcId = coinData.id.toString();
        } catch (error) {
          console.error("Error looking up CMC ID:", error);
          throw error;
        }
      }
      
      const response = await fetch(
        `${CMC_API_BASE_URL}/cryptocurrency/quotes/latest?id=${cmcId}&convert=USD`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': CMC_API_KEY,
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      const coinData = data.data[cmcId];
      
      // Create a simple chart data with just the current price
      const now = Date.now();
      const chartData: ChartData = {
        prices: [[now, coinData.quote.USD.price]],
        market_caps: [[now, coinData.quote.USD.market_cap]],
        total_volumes: [[now, coinData.quote.USD.volume_24h]]
      };
      
      console.log(`Real-time price for ${id} from CMC loaded: $${chartData.prices[0][1]}`);
      return chartData;
    } else {
      // For historical data, use CoinGecko API since CMC requires higher tier
      console.log(`Using CoinGecko for historical chart data for ${id}`);
      return await fetchCoingeckoChartData(id, days);
    }
  } catch (error) {
    console.error(`Failed to fetch chart data for ${id} from CMC:`, error);
    
    if (realtimeOnly) {
      // If realtime data fails, generate mock data
      if (process.env.NODE_ENV !== 'production') {
        console.log('Generating mock realtime chart data');
        return generateMockChartData(days, realtimeOnly);
      }
    } else {
      // Try CoinGecko for historical data
      try {
        return await fetchCoingeckoChartData(id, days);
      } catch (fallbackError) {
        console.error(`Failed to fetch chart data for ${id} from CoinGecko:`, fallbackError);
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('Falling back to mock chart data');
          return generateMockChartData(days, realtimeOnly);
        }
      }
    }
    
    return null;
  }
};

// Helper function to fetch chart data from CoinGecko
const fetchCoingeckoChartData = async (id: string, days: number): Promise<ChartData> => {
  // Implement more advanced error handling with exponential backoff
  let retries = 3;
  let response;
  let backoffTime = 1000; // Start with 1 second delay
  
  while (retries > 0) {
    try {
      // Add a cache-busting parameter to avoid potential caching issues
      const cacheBuster = `_cb=${Date.now()}`;
      
      response = await fetch(
        `${COINGECKO_API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}&${cacheBuster}`
      );
      
      if (response.ok) break;
      
      // If we get a rate limit error (429), wait longer
      if (response.status === 429) {
        console.log(`Rate limited on attempt ${4 - retries}, waiting ${backoffTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        backoffTime *= 2; // Exponential backoff
      } else {
        // For other errors, use standard backoff
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    } catch (fetchError) {
      console.error("Network error during fetch:", fetchError);
    }
    
    retries--;
    if (retries === 0) {
      console.error(`All retry attempts failed for ${id} chart data`);
      
      // For demo/development purposes, generate mock data if all retries fail
      if (process.env.NODE_ENV !== 'production') {
        console.log('Generating mock chart data for development');
        return generateMockChartData(days, false);
      }
      throw new Error(`Failed to fetch chart data after multiple retries`);
    }
  }
  
  if (!response || !response.ok) {
    throw new Error(`API Error: ${response?.status || 'unknown'}`);
  }
  
  const data = await response.json();
  console.log(`Chart data for ${id} (${days} days) loaded successfully: ${data.prices.length} points`);
  return data;
};

// Helper function to generate mock chart data when API fails
function generateMockChartData(days: number, realtimeOnly: boolean = false): ChartData {
  const now = Date.now();
  const prices: [number, number][] = [];
  const marketCaps: [number, number][] = [];
  const volumes: [number, number][] = [];
  
  // Generate realistic-looking price data
  let price = 30000 + Math.random() * 5000; // Starting price around $30k
  const volatility = realtimeOnly ? 0.005 : 0.02; // Lower volatility for real-time data
  const trend = 0.001;
  
  // For real-time data, generate fewer points with more recent timestamps
  const pointsToGenerate = realtimeOnly ? 12 : days * 24; // 12 points for real-time, hourly data for historical
  const timeStep = realtimeOnly ? (60 * 60 * 1000 / 12) : (24 * 60 * 60 * 1000 / pointsToGenerate);
  
  for (let i = 0; i < pointsToGenerate; i++) {
    // Random walk with slight upward trend
    const change = (Math.random() - 0.5) * volatility + trend;
    price = Math.max(100, price * (1 + change));
    
    const timestamp = now - (pointsToGenerate - i) * timeStep;
    prices.push([timestamp, price]);
    
    // Generate realistic market cap and volume data
    const marketCap = price * 19_000_000; // Assuming ~19M BTC in circulation
    const volume = marketCap * (0.01 + Math.random() * 0.05); // 1-6% daily volume
    
    marketCaps.push([timestamp, marketCap]);
    volumes.push([timestamp, volume]);
  }
  
  return {
    prices,
    market_caps: marketCaps,
    total_volumes: volumes
  };
}

export const fetchTrending = async (): Promise<TrendingResponse | null> => {
  try {
    // CoinMarketCap trending endpoints require higher tier plans
    // Use their latest listings sorted by % change as a proxy for trending
    const response = await fetch(
      `${CMC_API_BASE_URL}/cryptocurrency/listings/latest?limit=10&sort=percent_change_24h&sort_dir=desc&convert=USD`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert to app's TrendingResponse format
    const trendingCoins = data.data.map((coin: any) => ({
      item: {
        id: coin.slug,
        coin_id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        market_cap_rank: coin.cmc_rank,
        thumb: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
        small: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
        large: `https://s2.coinmarketcap.com/static/img/coins/128x128/${coin.id}.png`,
        slug: coin.slug,
        price_btc: coin.quote.USD.price / data.data[0].quote.USD.price, // Approximation relative to top coin
        score: Math.abs(coin.quote.USD.percent_change_24h)
      }
    }));
    
    return {
      coins: trendingCoins,
      nfts: [],
      categories: []
    };
  } catch (error) {
    console.error("Failed to fetch trending data from CMC:", error);
    
    // Fallback to CoinGecko
    try {
      console.log("Falling back to CoinGecko API for trending data");
      const response = await fetch(`${COINGECKO_API_BASE_URL}/search/trending`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (fallbackError) {
      console.error("Failed to fetch trending data from fallback:", fallbackError);
      return null;
    }
  }
};
