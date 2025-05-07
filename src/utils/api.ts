
import { CryptoCurrency, GlobalData, ChartData, TrendingResponse } from "../types/crypto";

const API_BASE_URL = "https://api.coingecko.com/api/v3";

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

export const fetchCryptoList = async (
  page: number = 1,
  perPage: number = 20
): Promise<CryptoCurrency[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&locale=en`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch crypto list:", error);
    return [];
  }
};

export const fetchGlobalData = async (): Promise<GlobalData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/global`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch global data:", error);
    return null;
  }
};

export const fetchCryptoDetails = async (id: string): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch details for ${id}:`, error);
    return null;
  }
};

export const fetchCryptoChart = async (
  id: string, 
  days: number = 7
): Promise<ChartData | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch chart data for ${id}:`, error);
    return null;
  }
};

export const fetchTrending = async (): Promise<TrendingResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/trending`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch trending data:", error);
    return null;
  }
};
