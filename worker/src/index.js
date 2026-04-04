/**
 * Cloudflare Worker — Survey submission proxy.
 * Receives form data, validates, and commits as JSON to a private GitHub repo.
 *
 * Environment variables (set via wrangler secret):
 *   GITHUB_TOKEN  — Fine-grained PAT with Contents:Write on survey-responses repo
 *   GITHUB_OWNER  — GitHub org/user (e.g., "Heilo27")
 *   GITHUB_REPO   — Private repo name (e.g., "survey-responses")
 *   ALLOWED_ORIGIN — Origin for CORS (e.g., "https://heiloprojects.com")
 */

export default {
    async fetch(request, env) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || 'https://heiloprojects.com',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        };

        // Preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        // Only POST
        if (request.method !== 'POST') {
            return json({ error: 'Method not allowed' }, 405, corsHeaders);
        }

        // Rate limit: 1 submission per IP per 30 seconds
        // (Cloudflare Workers KV or just trust basic dedup)

        let data;
        try {
            data = await request.json();
        } catch {
            return json({ error: 'Invalid JSON' }, 400, corsHeaders);
        }

        // Validate payload
        if (!data.survey_id || !data.responses || typeof data.responses !== 'object') {
            return json({ error: 'Missing survey_id or responses' }, 400, corsHeaders);
        }

        // Sanitize survey_id (alphanumeric + hyphens only)
        const surveyId = data.survey_id.replace(/[^a-z0-9-]/gi, '').slice(0, 50);
        if (!surveyId) {
            return json({ error: 'Invalid survey_id' }, 400, corsHeaders);
        }

        // Generate filename
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const rand = crypto.randomUUID().slice(0, 8);
        const path = `responses/${surveyId}/${ts}_${rand}.json`;

        // Commit to GitHub
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

        try {
            const ghRes = await fetch(
                `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                        'User-Agent': 'HeiloProjects-Survey-Worker/1.0',
                        'Accept': 'application/vnd.github+json',
                    },
                    body: JSON.stringify({
                        message: `Survey response: ${surveyId} (${ts})`,
                        content: content,
                    }),
                }
            );

            if (!ghRes.ok) {
                const err = await ghRes.text();
                console.error('GitHub API error:', ghRes.status, err);
                return json({ error: 'Submission storage failed' }, 502, corsHeaders);
            }

            return json({ success: true, id: `${ts}_${rand}` }, 200, corsHeaders);

        } catch (err) {
            console.error('Worker error:', err);
            return json({ error: 'Internal error' }, 500, corsHeaders);
        }
    }
};

function json(data, status, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...headers },
    });
}
