(() => {
  if (!['localhost','127.0.0.1'].includes(location.hostname) || !new URLSearchParams(location.search).has('debug')) return;
  const apiBase = '/api/v1';
  const css = `
    #iaa-backend-open{margin-left:10px;padding:8px 12px;border:1px solid #c9d5e6;border-radius:6px;background:#fff;color:#24344b;font:600 12px Arial,sans-serif;cursor:pointer}
    #iaa-backend-open:hover{background:#f2f6fb}
    #iaa-backend-open .iaa-backend-dot{display:inline-block;width:8px;height:8px;margin-right:7px;border-radius:50%;background:#a7b0be}
    .iaa-backend-backdrop{position:fixed;inset:0;z-index:99990;display:flex;justify-content:flex-end;background:#101b2b66}
    .iaa-backend-backdrop[hidden]{display:none}
    .iaa-backend-dialog{width:min(650px,100%);height:100%;overflow:auto;background:#f7f9fc;color:#24344b;box-shadow:-12px 0 42px #101b2b30;font:14px/1.5 Arial,sans-serif}
    .iaa-backend-head{position:sticky;top:0;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;padding:20px 24px;background:#fff;border-bottom:1px solid #dfe5ee}
    .iaa-backend-head h2{margin:0;font-size:20px}.iaa-backend-head p{margin:4px 0 0;color:#6b7789;font-size:12px}
    .iaa-backend-close{border:0;background:transparent;color:#526174;font-size:28px;line-height:1;cursor:pointer}
    .iaa-backend-body{padding:20px 24px}
    .iaa-backend-status{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}
    .iaa-backend-status article,.iaa-backend-card{padding:14px;border:1px solid #dfe5ee;border-radius:8px;background:#fff}
    .iaa-backend-status article{display:flex;align-items:center;gap:10px}
    .iaa-backend-status strong,.iaa-backend-status small{display:block}.iaa-backend-status small{color:#6b7789}
    .iaa-backend-indicator{width:10px;height:10px;flex:none;border-radius:50%;background:#a7b0be}
    .iaa-backend-indicator[data-state=ok]{background:#26966c}.iaa-backend-indicator[data-state=error]{background:#cb4a4a}
    .iaa-backend-section-title{margin:22px 0 10px;font-size:16px}
    .iaa-backend-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .iaa-backend-card h4{display:flex;justify-content:space-between;gap:10px;margin:0 0 8px;font-size:14px}
    .iaa-backend-count{color:#526174;font-size:11px;font-weight:400}
    .iaa-backend-card ul{margin:0;padding-left:17px}.iaa-backend-card li{margin:6px 0;overflow-wrap:anywhere}
    .iaa-backend-empty,.iaa-backend-error{color:#6b7789;font-size:12px}
    .iaa-backend-error{color:#a63d3d}
    .iaa-backend-note{margin-top:16px;padding:12px 14px;border-left:3px solid #d39a3c;background:#fff8e9;color:#665331;font-size:12px}
    .iaa-backend-actions{display:flex;justify-content:flex-end;margin-bottom:12px}
    .iaa-backend-refresh{padding:8px 12px;border:1px solid #c9d5e6;border-radius:6px;background:#fff;color:#24344b;font-weight:600;cursor:pointer}
    .iaa-backend-refresh:disabled{opacity:.55;cursor:wait}
    @media(max-width:520px){.iaa-backend-status,.iaa-backend-grid{grid-template-columns:1fr}.iaa-backend-body{padding:16px}.iaa-backend-head{padding:16px}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  const header = document.querySelector('#global-header .header-actions');
  if (!header) return;

  const openButton = document.createElement('button');
  openButton.id = 'iaa-backend-open';
  openButton.type = 'button';
  openButton.setAttribute('aria-haspopup', 'dialog');
  openButton.setAttribute('aria-expanded', 'false');
  openButton.setAttribute('aria-controls', 'iaa-backend-dialog');
  openButton.innerHTML = '<span class="iaa-backend-dot" aria-hidden="true"></span>Live backend';
  header.append(openButton);

  const backdrop = document.createElement('div');
  backdrop.className = 'iaa-backend-backdrop';
  backdrop.hidden = true;
  backdrop.innerHTML = `
    <section id="iaa-backend-dialog" class="iaa-backend-dialog" role="dialog" aria-modal="true" aria-labelledby="iaa-backend-title">
      <header class="iaa-backend-head">
        <div><h2 id="iaa-backend-title">Live backend data</h2><p>Published records from this portal's API and database.</p></div>
        <button class="iaa-backend-close" type="button" aria-label="Close">&times;</button>
      </header>
      <div class="iaa-backend-body">
        <div class="iaa-backend-actions"><button class="iaa-backend-refresh" type="button">Refresh live data</button></div>
        <div class="iaa-backend-status">
          <article><span class="iaa-backend-indicator" data-health-indicator></span><div><strong>API service</strong><small data-health>Not checked</small></div></article>
          <article><span class="iaa-backend-indicator" data-ready-indicator></span><div><strong>Database readiness</strong><small data-ready>Not checked</small></div></article>
        </div>
        <h3 class="iaa-backend-section-title">Public, released records</h3>
        <div class="iaa-backend-grid">
          <article class="iaa-backend-card"><h4>Projects <span class="iaa-backend-count" data-count="projects">Not loaded</span></h4><ul data-list="projects"></ul></article>
          <article class="iaa-backend-card"><h4>Datasets <span class="iaa-backend-count" data-count="datasets">Not loaded</span></h4><ul data-list="datasets"></ul></article>
          <article class="iaa-backend-card"><h4>Resources <span class="iaa-backend-count" data-count="resources">Not loaded</span></h4><ul data-list="resources"></ul></article>
          <article class="iaa-backend-card"><h4>Policies <span class="iaa-backend-count" data-count="policies">Not loaded</span></h4><ul data-list="policies"></ul></article>
        </div>
        <p class="iaa-backend-note">The explorer and planning screens continue to use the supplied Information Layer pack. These counts show only records published through the backend. Monitoring, administration, and project edits require OIDC authentication; this imported portal's local monitoring drafts are not sent to the server.</p>
        <p class="iaa-backend-error" role="status" aria-live="polite" data-error></p>
      </div>
    </section>`;
  document.body.append(backdrop);

  const dialog = backdrop.querySelector('.iaa-backend-dialog');
  const closeButton = backdrop.querySelector('.iaa-backend-close');
  const refreshButton = backdrop.querySelector('.iaa-backend-refresh');

  async function request(path) {
    const response = await fetch(`${apiBase}/${path}`, {
      headers: {Accept: 'application/json'},
      cache: 'no-store'
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error?.message || `Request failed (${response.status})`);
    return result;
  }

  function setStatus(name, state, text) {
    backdrop.querySelector(`[data-${name}-indicator]`).dataset.state = state;
    backdrop.querySelector(`[data-${name}]`).textContent = text;
    if (name === 'health') openButton.querySelector('.iaa-backend-dot').style.background = state === 'ok' ? '#26966c' : state === 'error' ? '#cb4a4a' : '#a7b0be';
  }

  function renderRecords(name, payload, label) {
    const rows = Array.isArray(payload?.data) ? payload.data : [];
    const count = backdrop.querySelector(`[data-count="${name}"]`);
    const list = backdrop.querySelector(`[data-list="${name}"]`);
    count.textContent = `${rows.length} returned`;
    list.replaceChildren();
    if (!rows.length) {
      const item = document.createElement('li');
      item.className = 'iaa-backend-empty';
      item.textContent = 'No published records available.';
      list.append(item);
      return;
    }
    for (const row of rows.slice(0, 5)) {
      const item = document.createElement('li');
      const title = label(row);
      item.textContent = title || 'Untitled record';
      list.append(item);
    }
  }

  async function refresh() {
    refreshButton.disabled = true;
    backdrop.querySelector('[data-error]').textContent = '';
    for (const name of ['projects', 'datasets', 'resources', 'policies']) {
      backdrop.querySelector(`[data-count="${name}"]`).textContent = 'Loading…';
      backdrop.querySelector(`[data-list="${name}"]`).replaceChildren();
    }
    const endpoints = [
      ['health', 'health'],
      ['ready', 'ready'],
      ['projects', 'wp1/projects?limit=5'],
      ['datasets', 'wp1/datasets'],
      ['resources', 'wp1/resources?limit=5'],
      ['policies', 'wp1/policies?limit=5']
    ];
    const results = await Promise.allSettled(endpoints.map(([, path]) => request(path)));
    const failures = [];
    for (let index = 0; index < endpoints.length; index += 1) {
      const [name] = endpoints[index];
      const result = results[index];
      if (result.status === 'rejected') {
        if (name === 'health' || name === 'ready') setStatus(name, 'error', 'Unavailable');
        else {
          backdrop.querySelector(`[data-count="${name}"]`).textContent = 'Unavailable';
          const item = document.createElement('li');
          item.className = 'iaa-backend-error';
          item.textContent = result.reason?.message || 'Request failed.';
          backdrop.querySelector(`[data-list="${name}"]`).append(item);
        }
        failures.push(`${name}: ${result.reason?.message || 'request failed'}`);
        continue;
      }
      const payload = result.value;
      if (name === 'health') setStatus('health', payload.status === 'ok' ? 'ok' : 'error', payload.status === 'ok' ? 'Available' : 'Unexpected response');
      else if (name === 'ready') setStatus('ready', payload.status === 'ready' ? 'ok' : 'error', payload.status === 'ready' ? 'Ready' : 'Not ready');
      else if (name === 'projects') renderRecords(name, payload, row => row.name || row.code);
      else if (name === 'datasets') renderRecords(name, payload, row => row.title || row.code);
      else if (name === 'resources') renderRecords(name, payload, row => row.title || row.code);
      else if (name === 'policies') renderRecords(name, payload, row => row.name || row.code);
    }
    backdrop.querySelector('[data-error]').textContent = failures.length ? `Some live API requests failed: ${failures.join('; ')}` : '';
    refreshButton.disabled = false;
  }

  function open() {
    backdrop.hidden = false;
    openButton.setAttribute('aria-expanded', 'true');
    closeButton.focus();
    refresh();
  }

  function close() {
    backdrop.hidden = true;
    openButton.setAttribute('aria-expanded', 'false');
    openButton.focus();
  }

  openButton.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  refreshButton.addEventListener('click', refresh);
  backdrop.addEventListener('click', event => {
    if (event.target === backdrop) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !backdrop.hidden) close();
  });
})();
