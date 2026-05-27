import fetch from 'node-fetch';
import FormData from 'form-data';

// Bypass local SSL issues if your local site is running http://
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configuration Endpoints
const OLD_SITE_API = 'https://kurunzinews.com/wp-json/wp/v2';
const NEW_SITE_API = 'http://kurunzi-sports.local/wp-json/wp/v2';

// Authentication Settings
const NEW_USERNAME = 'SleekSites'; 
const NEW_APP_PASSWORD = '9c3T wH5O W7Zx FZHm ufXb ALPX'; 

// Target Constraints
const SPORTS_CATEGORY_ID = 13; // Parent site ID for the broad "Sports" category

const authHeader = 'Basic ' + Buffer.from(`${NEW_USERNAME}:${NEW_APP_PASSWORD}`).toString('base64');

// Memory cache to track mapped Categories (Old ID -> New Local ID)
const categoryIdMap = {};

/**
 * Dynamically updates or creates categories locally, ignoring the parent "Sports" layer
 */
async function getOrCreateLocalCategory(oldCategory) {
  // If the term matches the parent "Sports" category ID, skip it entirely
  if (oldCategory.id === SPORTS_CATEGORY_ID) {
    return null; 
  }

  // If we already mapped this subcategory in this execution loop, return the cached ID
  if (categoryIdMap[oldCategory.id]) {
    return categoryIdMap[oldCategory.id];
  }

  try {
    // Check if the specific subcategory (e.g., handball) already exists on the local instance
    const checkRes = await fetch(`${NEW_SITE_API}/categories?slug=${oldCategory.slug}`, {
      headers: { 'Authorization': authHeader }
    });
    const existing = await checkRes.json();

    if (existing && existing.length > 0) {
      categoryIdMap[oldCategory.id] = existing[0].id;
      return existing[0].id;
    }

    // Create the category as a flat, top-level item if it doesn't exist
    console.log(`📁 Creating top-level category: ${oldCategory.name}...`);
    const createRes = await fetch(`${NEW_SITE_API}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        name: oldCategory.name,
        slug: oldCategory.slug
      })
    });

    if (createRes.ok) {
      const newCategory = await createRes.json();
      categoryIdMap[oldCategory.id] = newCategory.id;
      return newCategory.id;
    }
  } catch (err) {
    console.error(`⚠️ Error structuralizing category taxonomy "${oldCategory.name}":`, err.message);
  }

  return null;
}

/**
 * Primary Core Migration Process Engine
 */
async function migrate() {
  console.log('🚀 Initiating clean local migration from Kurunzi News...');

  try {
    // Fetch target articles matching the raw parent container category filter
    const res = await fetch(`${OLD_SITE_API}/posts?per_page=100&categories=${SPORTS_CATEGORY_ID}&_embed=true`);
    if (!res.ok) {
      throw new Error(`Failed to establish sync with parent server: ${res.status} ${res.statusText}`);
    }
    
    const articles = await res.json();
    console.log(`📦 Retracted ${articles.length} sports rows from source. Processing translations...`);

    for (const article of articles) {
      let localImageId = null;
      let localCategoryIds = [];

      // 1. DYNAMIC CATEGORY MAPPING
      if (article._embedded && article._embedded['wp:term']) {
        const categoriesGroup = article._embedded['wp:term'][0]; // index 0 maps to standard post categories
        for (const oldCat of categoriesGroup) {
          const localId = await getOrCreateLocalCategory(oldCat);
          if (localId) {
            localCategoryIds.push(localId);
          }
        }
      }

      // 2. FEATURED IMAGE TRANSLATION
      if (article._embedded && article._embedded['wp:featuredmedia']) {
        try {
          const mediaInfo = article._embedded['wp:featuredmedia'][0];
          const imageUrl = mediaInfo.source_url;
          
          if (imageUrl) {
            const filename = imageUrl.split('/').pop() || `image-${Date.now()}.jpg`;
            console.log(`📸 Streaming asset binary: ${filename}...`);
            
            const imageRes = await fetch(imageUrl);
            if (imageRes.ok) {
              const imageBuffer = await imageRes.buffer();

              const form = new FormData();
              form.append('file', imageBuffer, filename);

              const mediaUploadRes = await fetch(`${NEW_SITE_API}/media`, {
                method: 'POST',
                headers: {
                  ...form.getHeaders(),
                  'Authorization': authHeader
                },
                body: form
              });

              if (mediaUploadRes.ok) {
                const localMedia = await mediaUploadRes.json();
                localImageId = localMedia.id;
              }
            }
          }
        } catch (mediaError) {
          console.error(`⚠️ Asset migration bypassed for "${article.slug}":`, mediaError.message);
        }
      }

      // 3. COMPOSE LOAD AND POST NEW DATA SNAPSHOT
      const payload = {
        title: article.title.rendered,
        content: article.content.rendered,
        excerpt: article.excerpt.rendered,
        slug: article.slug,
        status: 'publish',
        date: article.date,
        featured_media: localImageId,
        categories: localCategoryIds // Flat array of clean, non-nested local IDs
      };

      const writeRes = await fetch(`${NEW_SITE_API}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(payload)
      });

      if (writeRes.ok) {
        console.log(`✅ Cleanly Migrated: "${article.title.rendered}"`);
      } else {
        const errorDetails = await writeRes.text();
        console.error(`❌ DB Write Failure for ${article.slug}. Context: ${errorDetails}`);
      }
    }
    
    console.log('🎉 Execution completely successful. Verify results at local wp-admin.');
  } catch (err) {
    console.error('🚨 Critical Runtime Crash on execution pipeline:', err);
  }
}

migrate();