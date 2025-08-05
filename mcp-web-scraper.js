#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');

// Supabase configuration - Use anon key for admin operations
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client with anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Web scraping functions
async function scrapeWebsite(url, selectors = {}) {
  try {
    console.log(`🌐 Scraping website: ${url}\n`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const data = {};

    // Extract data based on selectors
    Object.keys(selectors).forEach(key => {
      const selector = selectors[key];
      const elements = $(selector);
      
      if (elements.length > 0) {
        data[key] = elements.map((i, el) => $(el).text().trim()).get();
      } else {
        data[key] = [];
      }
    });

    console.log(`✅ Successfully scraped data from ${url}`);
    console.log(`   Found ${Object.keys(data).length} data fields`);
    
    return data;
  } catch (error) {
    console.error('❌ Error scraping website:', error.message);
    return null;
  }
}

async function scrapeMarketPrices() {
  try {
    console.log('📊 Scraping agricultural market prices...\n');
    
    // Example: Scrape from a hypothetical agricultural price website
    const url = 'https://example-agricultural-prices.com';
    const selectors = {
      'tomatoes': '.price-tomatoes',
      'potatoes': '.price-potatoes',
      'onions': '.price-onions',
      'wheat': '.price-wheat'
    };

    const data = await scrapeWebsite(url, selectors);
    
    if (data) {
      console.log('📈 Market Prices:');
      Object.entries(data).forEach(([item, prices]) => {
        if (prices.length > 0) {
          console.log(`   ${item}: ${prices[0]}`);
        }
      });
      
      // Store in database
      await storeMarketPrices(data);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error scraping market prices:', error);
  }
}

async function scrapeWeatherData(location = 'Algiers') {
  try {
    console.log(`🌤️  Scraping weather data for ${location}...\n`);
    
    // Example: Scrape from a weather website
    const url = `https://example-weather.com/${location}`;
    const selectors = {
      'temperature': '.temperature',
      'humidity': '.humidity',
      'wind': '.wind-speed',
      'forecast': '.forecast'
    };

    const data = await scrapeWebsite(url, selectors);
    
    if (data) {
      console.log('🌤️  Weather Data:');
      Object.entries(data).forEach(([key, values]) => {
        if (values.length > 0) {
          console.log(`   ${key}: ${values[0]}`);
        }
      });
      
      // Store in database
      await storeWeatherData(location, data);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error scraping weather data:', error);
  }
}

async function scrapeEquipmentListings() {
  try {
  console.log('🔧 Scraping equipment listings...\n');
  
  // Example: Scrape from an equipment marketplace
  const url = 'https://example-equipment-marketplace.com';
  const selectors = {
    'tractors': '.tractor-listing',
    'harvesters': '.harvester-listing',
    'irrigation': '.irrigation-listing',
    'prices': '.price'
  };

  const data = await scrapeWebsite(url, selectors);
  
  if (data) {
    console.log('🔧 Equipment Listings:');
    Object.entries(data).forEach(([category, items]) => {
      console.log(`   ${category}: ${items.length} items found`);
    });
    
    // Store in database
    await storeEquipmentListings(data);
  }
  
  return data;
} catch (error) {
  console.error('❌ Error scraping equipment listings:', error);
}
}

async function scrapeNewsArticles() {
  try {
    console.log('📰 Scraping agricultural news...\n');
    
    // Example: Scrape from an agricultural news website
    const url = 'https://example-agricultural-news.com';
    const selectors = {
      'headlines': '.article-headline',
      'summaries': '.article-summary',
      'dates': '.article-date',
      'categories': '.article-category'
    };

    const data = await scrapeWebsite(url, selectors);
    
    if (data) {
      console.log('📰 Agricultural News:');
      if (data.headlines && data.headlines.length > 0) {
        data.headlines.slice(0, 5).forEach((headline, index) => {
          console.log(`   ${index + 1}. ${headline}`);
        });
      }
      
      // Store in database
      await storeNewsArticles(data);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error scraping news articles:', error);
  }
}

async function storeMarketPrices(data) {
  try {
    const { error } = await supabase
      .from('market_prices')
      .insert({
        data: data,
        scraped_at: new Date().toISOString(),
        source: 'web_scraper'
      });

    if (error) {
      console.error('❌ Error storing market prices:', error);
    } else {
      console.log('✅ Market prices stored in database');
    }
  } catch (error) {
    console.error('❌ Error in storeMarketPrices:', error);
  }
}

async function storeWeatherData(location, data) {
  try {
    const { error } = await supabase
      .from('weather_data')
      .insert({
        location: location,
        data: data,
        scraped_at: new Date().toISOString(),
        source: 'web_scraper'
      });

    if (error) {
      console.error('❌ Error storing weather data:', error);
    } else {
      console.log('✅ Weather data stored in database');
    }
  } catch (error) {
    console.error('❌ Error in storeWeatherData:', error);
  }
}

async function storeEquipmentListings(data) {
  try {
    const { error } = await supabase
      .from('equipment_listings')
      .insert({
        data: data,
        scraped_at: new Date().toISOString(),
        source: 'web_scraper'
      });

    if (error) {
      console.error('❌ Error storing equipment listings:', error);
    } else {
      console.log('✅ Equipment listings stored in database');
    }
  } catch (error) {
    console.error('❌ Error in storeEquipmentListings:', error);
  }
}

async function storeNewsArticles(data) {
  try {
    const { error } = await supabase
      .from('news_articles')
      .insert({
        data: data,
        scraped_at: new Date().toISOString(),
        source: 'web_scraper'
      });

    if (error) {
      console.error('❌ Error storing news articles:', error);
    } else {
      console.log('✅ News articles stored in database');
    }
  } catch (error) {
    console.error('❌ Error in storeNewsArticles:', error);
  }
}

async function getScrapedData(tableName) {
  try {
    console.log(`📊 Fetching scraped data from ${tableName}...\n`);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('scraped_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error(`❌ Error fetching ${tableName}:`, error);
      return;
    }

    if (!data || data.length === 0) {
      console.log(`📭 No data found in ${tableName}.`);
      return;
    }

    console.log(`✅ Found ${data.length} record(s) in ${tableName}:\n`);
    
    data.forEach((record, index) => {
      console.log(`📊 Record ${index + 1}:`);
      console.log(`   Scraped: ${record.scraped_at}`);
      console.log(`   Source: ${record.source}`);
      console.log(`   Data: ${JSON.stringify(record.data).substring(0, 100)}...`);
      console.log('');
    });

  } catch (error) {
    console.error(`❌ Error getting ${tableName}:`, error);
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  
  switch (command) {
    case 'scrape':
      if (!arg1) {
        console.log('❌ Usage: node mcp-web-scraper.js scrape <url>');
        return;
      }
      await scrapeWebsite(arg1);
      break;
      
    case 'prices':
      await scrapeMarketPrices();
      break;
      
    case 'weather':
      await scrapeWeatherData(arg1);
      break;
      
    case 'equipment':
      await scrapeEquipmentListings();
      break;
      
    case 'news':
      await scrapeNewsArticles();
      break;
      
    case 'data':
      if (!arg1) {
        console.log('❌ Usage: node mcp-web-scraper.js data <tablename>');
        return;
      }
      await getScrapedData(arg1);
      break;
      
    default:
      console.log('🚀 Web Scraper MCP - Available Commands:');
      console.log('  node mcp-web-scraper.js scrape <url>           - Scrape custom website');
      console.log('  node mcp-web-scraper.js prices                  - Scrape market prices');
      console.log('  node mcp-web-scraper.js weather [location]      - Scrape weather data');
      console.log('  node mcp-web-scraper.js equipment               - Scrape equipment listings');
      console.log('  node mcp-web-scraper.js news                    - Scrape agricultural news');
      console.log('  node mcp-web-scraper.js data <tablename>        - View scraped data');
      break;
  }
}

// Run the main function
main().catch(console.error); 