# Connect the existing portal

Use src/lib/client.ts. Pass an asynchronous getAccessToken function from the configured OIDC login client. Anonymous WP2 follow-up calls need planningToken instead.

## Integrated Agrivoltaics Portal

The supplied single-file portal is served by this Next.js application at `/portal/index.html`; `/` redirects there. The refreshed portal UI, including its expanded farm-planning and techno-economic screening flow, is kept as a static asset under `public/portal`. Its map and Information Layer data remain client-side assets while the API remains under `/api/v1` on the same origin. No separate CORS configuration is needed.

The WP1 universal search is available across the map and project views. It suggests included districts and map records (projects, feeders, substations, and facilities), focuses the map on a selected result, and keeps location, map-layer, and project filters in the compact toolbar. Search results are limited to the included Information Layer coverage.

The isolated development database seed includes `WP1-DEMO-001` as an explicitly illustrative draft. In development mode, WP1 loads it from `GET /api/v1/wp1/demo-project` for the registry, map/search, and detail view. This development-only endpoint sets `illustrative_only=true` and `publicly_released=false`; it is separate from `GET /api/v1/wp1/projects`, which remains limited to reviewed public releases, and returns 404 outside development mode. The sample is excluded from planning calculations and has no monitoring action, evidence, or published observations. Do not deploy the demo seed to a production database.

Use the **Live backend** control in the portal header to check `/api/v1/health` and `/api/v1/ready`, and view published projects, datasets, resources, and policies. These are database-backed, released records; the explorer and planning screens still use the supplied Information Layer pack and clearly remain separate from database publication.

The imported portal's WP3 monitoring drafts are stored in browser local storage and are not submitted to the backend. Backend monitoring, administration, and project-edit routes require an OIDC access token. Do not treat portal-local drafts as approved or persisted server records; wire those workflows to the protected API using the project's OIDC client before production use.

```ts
const api = createIaaClient('/api/v1', async () => identityClient.getAccessToken());
const projects = await api.request('wp1/projects');
const nearby = await api.request('wp1/nearby?lat=28.61&lon=77.21&radiusKm=10');
const ownProjects = await api.request('internal/projects');
```

Select existing geography/project UUIDs from API responses. Preserve units and reference dates when drawing charts. Do not turn unavailable/null metrics into zero. Use geometry to focus the persistent map when changing tab/project/location. Map movement, resizing, floating position and filter-drawer layout stay in the frontend. Do not embed DATABASE_URL, a migration credential or a shared administrator token in the browser bundle.

Use WORKFLOWS.md for each screen-to-API mapping, full typed record writes and lifecycle actions. Resource writes use snake_case, while workflow bodies use the camelCase names shown there. Both are strict; unknown keys are rejected.

The backend does not change the existing static HTML automatically. Deploy UI/API under one origin or use an explicit permitted-origin gateway. Send files as raw bytes to /files, not JSON base64 or FormData.
