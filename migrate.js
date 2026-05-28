import fetch from 'node-fetch';
import FormData from 'form-data';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const OLD_SITE_API = 'https://kurunzinews.com/wp-json/wp/v2';
const NEW_SITE_API = 'http://kurunzi-sports.local/wp-json/wp/v2';

const NEW_USERNAME = 'SleekSites'; 
const NEW_APP_PASSWORD = '9c3T wH5O W7Zx FZHm ufXb ALPX'; 

const SPORTS_CATEGORY_ID = 13; 
const authHeader = 'Basic ' + Buffer.from(`${NEW_USERNAME}:${NEW_APP_PASSWORD}`).toString('base64');

// Memory caches to eliminate duplicate API requests across batches
const categoryIdMap = {};
const authorIdMap = {};
const tagIdMap = {};

/**
 * Dynamically mirrors post tags
 */
async function getOrCreateLocalTag(oldTag) {
  if (!oldTag || !oldTag.slug) return null;
  if (tagIdMap[oldTag.id]) return tagIdMap[oldTag.id];

  try {
    // Check if the tag exists locally
    const checkRes = await fetch(`${NEW_SITE_API}/tags?slug=${oldTag.slug}`, {
      headers: { 'Authorization': authHeader }
    });
    const existing = await checkRes.json();

    if (existing && existing.length > 0) {
      tagIdMap[oldTag.id] = existing[0].id;
      return existing[0].id;
    }

    // Create the tag locally if missing
    console.log(`🏷️  Creating tag locally: #${oldTag.name}...`);
    const createRes = await fetch(`${NEW_SITE_API}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ name: oldTag.name, slug: oldTag.slug })
    });

    if (createRes.ok) {
      const newTag = await createRes.json();
      tagIdMap[oldTag.id] = newTag.id;
      return newTag.id;
    }
  } catch (err) {
    console.error(`⚠️ Tag alignment error for "${oldTag.name}":`, err.message);
  }
  return null;
}

/**
 * Dynamically tracks, validates, and creates post authors locally
 */
async function getOrCreateLocalAuthor(oldAuthor) {
  if (!oldAuthor || !oldAuthor.slug) return null;
  if (authorIdMap[oldAuthor.id]) return authorIdMap[oldAuthor.id];

  try {
    const checkRes = await fetch(`${NEW_SITE_API}/users?slug=${oldAuthor.slug}`, {
      headers: { 'Authorization': authHeader }
    });
    const existing = await checkRes.json();

    if (existing && existing.length > 0) {
      authorIdMap[oldAuthor.id] = existing[0].id;
      return existing[0].id;
    }

    console.log(`👤 Creating writer profile: ${oldAuthor.name}...`);
    const createRes = await fetch(`${NEW_SITE_API}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        username: oldAuthor.slug,
        name: oldAuthor.name,
        slug: oldAuthor.slug,
        email: `${oldAuthor.slug}@kurunzisports.com`,
        password: Math.random().toString(36).slice(-12),
        roles: ['author']
      })
    });

    if (createRes.ok) {
      const newUser = await createRes.json();
      authorIdMap[oldAuthor.id] = newUser.id;
      return newUser.id;
    }
  } catch (err) {
    console.error(`⚠️ Author alignment error:`, err.message);
  }
  return null;
}

/**
 * Dynamically filters and mirrors categories
 */
async function getOrCreateLocalCategory(oldCategory) {
  if (oldCategory.id === SPORTS_CATEGORY_ID) return null; 
  if (categoryIdMap[oldCategory.id]) return categoryIdMap[oldCategory.id];

  try {
    const checkRes = await fetch(`${NEW_SITE_API}/categories?slug=${oldCategory.slug}`, {
      headers: { 'Authorization': authHeader }
    });
    const existing = await checkRes.json();

    if (existing && existing.length > 0) {
      categoryIdMap[oldCategory.id] = existing[0].id;
      return existing[0].id;
    }

    console.log(`📁 Creating top-level category: ${oldCategory.name}...`);
    const createRes = await fetch(`${NEW_SITE_API}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ name: oldCategory.name, slug: oldCategory.slug })
    });

    if (createRes.ok) {
      const newCategory = await createRes.json();
      categoryIdMap[oldCategory.id] = newCategory.id;
      return newCategory.id;
    }
  } catch (err) {
    console.error(`⚠️ Category alignment error:`, err.message);
  }
  return null;
}

/**
 * Main Sync Pipeline Engine with Automatic Pagination Loops
 */
async function migrate() {
  console.log('🚀 Starting Master Migration Pipeline (Target: 492 Articles with Tags)...');

  let page = 1;
  const perPage = 50; 
  let totalMigratedCount = 0;
  let keepFetching = true;

  while (keepFetching) {
    console.log(`\n==================================================`);
    console.log(`📄 FETCHING CHUNK: Processing Page ${page}...`);
    console.log(`==================================================\n`);

    try {
      const res = await fetch(
        `${OLD_SITE_API}/posts?per_page=${perPage}&page=${page}&categories=${SPORTS_CATEGORY_ID}&_embed=true`, 
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        }
      );
      
      if (!res.ok) {
        console.log(`❌ Server stopped returning data at page ${page}. Code: ${res.status} (${res.statusText})`);
        keepFetching = false;
        break;
      }
      
      const articles = await res.json();

      if (!articles || articles.length === 0) {
        console.log('🏁 Reached the end of the content inventory record stream.');
        keepFetching = false;
        break;
      }

      console.log(`📦 Pulled ${articles.length} records on Page ${page}. Processing...`);

      for (const article of articles) {
        let localImageId = null;
        let localCategoryIds = [];
        let localTagIds = [];
        let localAuthorId = null;

        // 1. AUTHOR RESOLUTION
        if (article._embedded && article._embedded['author'] && article._embedded['author'][0]) {
          localAuthorId = await getOrCreateLocalAuthor(article._embedded['author'][0]);
        }

        // 2. TAXONOMY RESOLUTION (Index 0 is always categories, Index 1 is always tags)
        if (article._embedded && article._embedded['wp:term']) {
          // Process Categories
          const categoriesGroup = article._embedded['wp:term'][0] || [];
          for (const oldCat of categoriesGroup) {
            const localId = await getOrCreateLocalCategory(oldCat);
            if (localId) localCategoryIds.push(localId);
          }

          // Process Tags
          const tagsGroup = article._embedded['wp:term'][1] || [];
          for (const oldTag of tagsGroup) {
            const localId = await getOrCreateLocalTag(oldTag);
            if (localId) localTagIds.push(localId);
          }
        }

        // 3. IMAGE MEDIA ATTACHMENT STREAMING
        if (article._embedded && article._embedded['wp:featuredmedia']) {
          try {
            const mediaInfo = article._embedded['wp:featuredmedia'][0];
            const imageUrl = mediaInfo.source_url;
            
            if (imageUrl) {
              const filename = imageUrl.split('/').pop() || `image-${Date.now()}.jpg`;
              const imageRes = await fetch(imageUrl);
              if (imageRes.ok) {
                const imageBuffer = await imageRes.buffer();
                const form = new FormData();
                form.append('file', imageBuffer, filename);

                const mediaUploadRes = await fetch(`${NEW_SITE_API}/media`, {
                  method: 'POST',
                  headers: { ...form.getHeaders(), 'Authorization': authHeader },
                  body: form
                });

                if (mediaUploadRes.ok) {
                  const localMedia = await mediaUploadRes.json();
                  localImageId = localMedia.id;
                }
              }
            }
          } catch (mediaError) {
            console.error(`⚠️ Asset bypass for: ${article.slug}`);
          }
        }

        // 4. GENERATE CLEAN DATABASE ENTRIES
        const payload = {
          title: article.title.rendered,
          content: article.content.rendered,
          excerpt: article.excerpt.rendered, 
          slug: article.slug,
          status: 'publish',
          date: article.date,
          featured_media: localImageId,
          categories: localCategoryIds,
          tags: localTagIds, // 💡 Seamlessly passing the new array of local Tag IDs
          author: localAuthorId 
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
          totalMigratedCount++;
          console.log(`[${totalMigratedCount}/492] ✅ Fully Imported: "${article.title.rendered}"`);
        } else {
          console.error(`❌ DB Write Failure for ${article.slug}`);
        }
      }

      page++;

    } catch (err) {
      console.error(`🚨 Network loop exception encountered on Page ${page}:`, err.message);
      console.log('⏳ Cooling down connection for 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log(`\n🎉 MASTER SYNC SUCCESSFUL! Total sports data nodes completed: ${totalMigratedCount}\n`);
}

migrate();