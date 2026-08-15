import { useMemo, useState } from 'react';
import { ArrowUpRight, Save, Utensils } from 'lucide-react';
import { normalizeSpecialPlattersSettings } from '../data/content';

const isPublished = (status) => !status || ['Published', 'Active'].includes(status);

function SpecialPlattersPage({ state, commit, notify }) {
  const [draft, setDraft] = useState(() => normalizeSpecialPlattersSettings(state.homepage || {}));
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  const categories = useMemo(() => (
    [...(state.categories || [])]
      .filter((category) => !['Archived', 'Inactive'].includes(category.status))
      .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999))
  ), [state.categories]);

  const selectedCategory = useMemo(() => categories.find((category) => (
    String(category.name || '').trim().toLowerCase()
      === String(draft.specialPlattersCategory || '').trim().toLowerCase()
  )), [categories, draft.specialPlattersCategory]);

  const platterItems = useMemo(() => (state.menuItems || []).filter((item) => (
    isPublished(item.status)
    && String(item.category || '').trim().toLowerCase()
      === String(draft.specialPlattersCategory || '').trim().toLowerCase()
  )).sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999)), [state.menuItems, draft.specialPlattersCategory]);

  const save = () => {
    const settings = normalizeSpecialPlattersSettings({
      ...draft,
      specialPlattersCategory: String(draft.specialPlattersCategory || '').trim(),
    });
    setDraft(settings);
    commit((current) => ({
      ...current,
      homepage: { ...current.homepage, ...settings },
    }));
    notify('Naseeb Special Platters settings published successfully.');
  };

  return <section className="admin-content-page admin-special-platters-page">
    <div className="admin-editor-grid">
      <div className="admin-editor-main">
        <div className="admin-panel admin-form-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-panel-kicker">Homepage carousel</span>
              <h2>Naseeb Special Platters</h2>
              <p>Control the platter section independently and select which published menu category supplies its dishes.</p>
            </div>
            <span className={`admin-status ${draft.showSpecialPlatters !== false ? 'positive' : 'muted'}`}>
              <i />{draft.showSpecialPlatters !== false ? 'Published' : 'Hidden'}
            </span>
          </div>

          <div className="admin-form admin-editor-form">
            <div className="admin-two-col">
              <label>Section label
                <input value={draft.specialPlattersEyebrow || ''} onChange={(event) => update('specialPlattersEyebrow', event.target.value)} placeholder="Made to share" />
              </label>
              <label>Section title
                <input value={draft.specialPlattersTitle || ''} onChange={(event) => update('specialPlattersTitle', event.target.value)} placeholder="Naseeb Special Platters" />
              </label>
            </div>

            <label>Section subtitle
              <textarea rows="4" value={draft.specialPlattersSubtitle || ''} onChange={(event) => update('specialPlattersSubtitle', event.target.value)} />
            </label>

            <div className="admin-two-col">
              <label>Platter menu category
                <select value={draft.specialPlattersCategory || ''} onChange={(event) => update('specialPlattersCategory', event.target.value)}>
                  <option value="">Select category</option>
                  {categories.map((category) => <option key={category.id || category.name} value={category.name}>{category.name}</option>)}
                </select>
              </label>
              <label>Button label
                <input value={draft.specialPlattersButtonLabel || ''} onChange={(event) => update('specialPlattersButtonLabel', event.target.value)} placeholder="Explore Platters" />
              </label>
            </div>

            <div className="admin-two-col">
              <label>Autoplay speed (milliseconds)
                <input type="number" min="3000" max="12000" step="100" value={draft.specialPlattersSpeed ?? 5800} onChange={(event) => update('specialPlattersSpeed', event.target.value)} />
              </label>
              <div className="admin-field-summary">
                <strong>{platterItems.length} published platter {platterItems.length === 1 ? 'dish' : 'dishes'}</strong>
                <small>{platterItems.length ? 'These dishes will rotate in the homepage carousel.' : 'Add dishes to the selected category from Menu Management.'}</small>
              </div>
            </div>

            <label className="admin-switch-row">
              <input type="checkbox" checked={draft.showSpecialPlatters !== false} onChange={(event) => update('showSpecialPlatters', event.target.checked)} />
              <span className="admin-switch" />
              <span>Show Naseeb Special Platters on the homepage</span>
            </label>
            <label className="admin-switch-row">
              <input type="checkbox" checked={draft.specialPlattersAutoplay !== false} onChange={(event) => update('specialPlattersAutoplay', event.target.checked)} />
              <span className="admin-switch" />
              <span>Enable carousel autoplay</span>
            </label>
            <small className="admin-field-help">Only published menu items assigned to the selected category appear in this section.</small>
          </div>
        </div>
      </div>

      <aside className="admin-editor-side">
        <div className="admin-panel admin-preview-panel admin-platter-preview">
          <div className="admin-panel-heading">
            <div><span className="admin-panel-kicker">Live summary</span><h2>Carousel content</h2></div>
            <Utensils size={18} />
          </div>
          <div className="admin-platter-preview-cover">
            <img src={platterItems[0]?.image || selectedCategory?.image || '/naseeb-chapati-logo.png'} alt="Special platter section preview" />
            <span>{draft.specialPlattersEyebrow || 'Made to share'}</span>
            <h3>{draft.specialPlattersTitle || 'Naseeb Special Platters'}</h3>
          </div>
          <div className="admin-platter-preview-list">
            {platterItems.slice(0, 4).map((item) => <div key={item.id || item.name}>
              <img src={item.image || '/naseeb-chapati-logo.png'} alt="" />
              <span><strong>{item.name}</strong><small>{item.category}</small></span>
            </div>)}
            {!platterItems.length ? <p>Select a category with published dishes to preview the carousel items.</p> : null}
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="admin-outline-button">Preview homepage <ArrowUpRight size={15} /></a>
        </div>
        <button className="admin-primary-button admin-save-wide" type="button" onClick={save}><Save size={16} />Publish Special Platters</button>
      </aside>
    </div>
  </section>;
}

export default SpecialPlattersPage;
