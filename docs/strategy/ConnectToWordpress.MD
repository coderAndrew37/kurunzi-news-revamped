Install and activate these specific plugins. This turns WordPress into a high-performance headless engine.

Plugin,Purpose,Why it’s essential
WPGraphQL,Data Layer,Provides a GraphQL schema for Next.js to query. Faster than REST.
Advanced Custom Fields (ACF),Schema Design,"Replaces Sanity's ""Schemas."" Defines ""Match Scores,"" ""Lineups,"" etc."
WPGraphQL for ACF,Bridge,Exposes your ACF data to the GraphQL endpoint.
WP Webhooks,Automation,"Triggers a Vercel rebuild whenever Ken clicks ""Publish."""

WPGraphQL: Go to Plugins > Add New and search for "WPGraphQL". Install and Activate.

ACF (Advanced Custom Fields): Search for "Advanced Custom Fields". Install and Activate.

WPGraphQL for ACF: This usually isn't in the main store.

Download: Go to WPGraphQL for ACF on GitHub and download the .zip.

Upload: In WordPress, go to Plugins > Add New > Upload Plugin and select that zip.

WP Webhooks: Search for "WP Webhooks". Install and Activate.
