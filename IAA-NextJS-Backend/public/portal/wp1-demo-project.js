(() => {
  let demoProject = null;
  const noteText = 'Illustrative WP1 demo loaded from this isolated development database. It is an unreviewed draft, not part of the public project registry; all sample values are dummy and not site-verified.';

  const style = document.createElement('style');
  style.textContent = '.wp1-demo-note{margin:12px 0;padding:12px 14px;border:1px solid #e8c97e;border-left:4px solid #c38a22;border-radius:6px;background:#fff8e9;color:#665331;font-size:12px;line-height:1.5}.wp1-demo-card{margin-top:10px}';
  document.head.append(style);

  const originalProjectCard = projectCard;
  projectCard = item => {
    const markup = originalProjectCard(item);
    return item.illustrative
      ? markup.replace('Project register · Baseline 2025 · Profile release 2025.1', 'WP1 demo API · illustrative only · development draft')
      : markup;
  };

  const originalRegistry = registry;
  registry = () => {
    if (!demoProject) return originalRegistry();
    projects.push(demoProject);
    try {
      return originalRegistry();
    } finally {
      projects.pop();
    }
  };

  const originalFilteredProjects = filteredProjects;
  filteredProjects = () => {
    const results = originalFilteredProjects();
    if (!demoProject) return results;
    const filters = state.filters;
    const query = String(filters.q || '').toLowerCase();
    const matches =
      (demoProject.name + ' ' + demoProject.id + ' ' + demoProject.district).toLowerCase().includes(query) &&
      ['state', 'district', 'status', 'type', 'crop', 'ownership'].every(key => !filters[key] || filters[key] === demoProject[key]) &&
      (!filters.capacity || (filters.capacity === 'lt1' ? demoProject.capacity < 1 : demoProject.capacity >= 1));
    if (matches) results.push(demoProject);
    return results;
  };

  const originalMapFeatures = mapFeatures;
  mapFeatures = () => {
    const features = originalMapFeatures();
    if (demoProject && state.layers.has(2) &&
        (!state.mapState || demoProject.state === state.mapState) &&
        (!state.mapDistrict || demoProject.district === state.mapDistrict) &&
        (demoProject.name + ' ' + demoProject.id + ' ' + demoProject.district).toLowerCase().includes(state.mapQ.toLowerCase())) {
      features.push({...demoProject, kind: 'project', domain: 2, color: '#294cdb'});
    }
    return features;
  };

  const originalProject = project;
  project = () => {
    if (!demoProject || state.project !== demoProject.id) return originalProject();
    projects.push(demoProject);
    let markup;
    try {
      markup = originalProject();
    } finally {
      projects.pop();
    }
    return markup
      .replace('Public approved summary', 'Illustrative WP1 sample — not publicly released')
      .replace('2025.1', 'Not supplied')
      .replace('2025', 'Not supplied')
      .replace('Published observations', 'Illustrative sample — no published observations')
      .replace('Project reporting register', 'No source — UI demo only')
      .replace('15 January 2026', 'Not reviewed')
      .replace('null animals', 'Not supplied')
      .replace('No livestock component', 'Not supplied');
  };

  const originalValuesFor = valuesFor;
  valuesFor = item => {
    const values = originalValuesFor(item);
    if (!item.illustrative) return values;
    for (const key of Object.keys(values)) values[key] = 'Not supplied — illustrative WP1 sample';
    Object.assign(values, {
      'Project name': demoProject.name,
      'State, city': `${demoProject.state} / ${demoProject.district} (illustrative)`,
      'GPS location': 'Approximate map pin for UI display only; not site-verified',
      'Installed capacity': `${demoProject.capacity} MWp DC (dummy example)`,
      'Type of Agrivoltaics Plant': `${demoProject.type} (example)`,
      'Nature of land ownership': 'Illustrative only',
      'Actual annual electricity generation': 'Not supplied — sample is not commissioned',
      'Land area details': `${demoProject.area} ha total / ${demoProject.cultivated} ha cultivated (dummy assumptions)`,
      'Area for AgriPV installation': 'Not assessed',
      'Crops': `${demoProject.crop} / ${demoProject.season}`,
      'Yield impact': 'Not supplied — no crop observations',
      'Date of commission': 'Not commissioned',
      'Photographs': 'No evidence attached — illustrative sample only'
    });
    return values;
  };

  const originalRender = render;
  render = function (...args) {
    const result = originalRender.apply(this, args);
    if (state.route === 'project' && demoProject && state.project === demoProject.id) {
      const content = document.getElementById('screen-content');
      if (content) {
        const note = document.createElement('div');
        note.className = 'wp1-demo-note';
        note.textContent = noteText;
        content.insertBefore(note, content.firstChild);
        content.querySelectorAll('button, a').forEach(control => {
          if (/^(Export profile|Plan this site|Monitor this site|Compare projects →|Source details →)$/.test(control.textContent.trim())) {
            control.remove();
          }
        });
        const sourceLine = content.querySelector('.source-line');
        if (sourceLine) sourceLine.textContent = 'WP1 demo API · no observations, evidence or public release';
        const evidence = content.querySelector('.evidence-grid');
        if (evidence) {
          const message = document.createElement('p');
          message.className = 'small muted';
          message.textContent = 'No evidence attached — this is an illustrative UI sample.';
          evidence.replaceWith(message);
        }
      }
    }
    return result;
  };

  const showLoadError = error => {
    console.error('Unable to load WP1 demo project from API', error);
    if (!['projects', 'map', 'project'].includes(state.route)) return;
    const content = document.getElementById('screen-content');
    if (!content || content.querySelector('.wp1-demo-note')) return;
    const note = document.createElement('div');
    note.className = 'wp1-demo-note';
    note.textContent = 'The WP1 demo project could not be loaded from the API. Check the development database and try again.';
    content.insertBefore(note, content.firstChild);
  };

  fetch('/api/v1/wp1/demo-project', {headers: {Accept: 'application/json'}})
    .then(async response => {
      if (!response.ok) throw new Error(`WP1 demo API returned HTTP ${response.status}`);
      const payload = await response.json();
      const record = payload?.data;
      if (!record || record.illustrative_only !== true || record.publicly_released !== false) {
        throw new Error('WP1 demo API returned an unexpected record');
      }
      const coordinates = record.geometry?.coordinates;
      if (!Array.isArray(coordinates) || coordinates.length < 2) {
        throw new Error('WP1 demo API record has no map coordinates');
      }
      demoProject = {
        id: record.code,
        projectId: record.project_id,
        name: record.name,
        state: record.state,
        district: record.district,
        status: record.status === 'planned' ? 'Planned' : record.status,
        type: record.mounting_type,
        crop: record.crop,
        ownership: record.ownership,
        capacity: Number(record.capacity_dc_mwp),
        area: Number(record.site_area_ha),
        cultivated: Number(record.crop_area_ha),
        lat: Number(coordinates[1]),
        lon: Number(coordinates[0]),
        generation: null,
        yield: null,
        baseline: null,
        season: record.season,
        livestock: null,
        water: null,
        illustrative: true
      };
      render();
    })
    .catch(showLoadError);
})();
