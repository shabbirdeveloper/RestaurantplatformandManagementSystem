import { useState } from 'react';
import { ArrowUpRight, ChevronDown, CircleAlert, Plus, Save, Trash2, Upload, Utensils } from 'lucide-react';
import { normalizeSpecialPlatterItems, normalizeSpecialPlattersSettings } from '../data/content';
import { isSupabaseConfigured, uploadMediaFile } from '../lib/supabase';

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

function SpecialPlattersPage({ state, commit, notify }) {
  const [draft, setDraft] = useState(() => normalizeSpecialPlattersSettings(state.homepage || {}));
  const [uploadingItem, setUploadingItem] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const updateItem = (id, changes) => setDraft((current) => ({
    ...current,
    specialPlattersItems: current.specialPlattersItems.map((item) => item.id === id ? { ...item, ...changes } : item),
  }));
  const addItem = () => setDraft((current) => ({
    ...current,
    specialPlattersItems: [...current.specialPlattersItems, {
      id: globalThis.crypto?.randomUUID?.() || `special-platter-${Date.now()}`,
      name: '',
      description: '',
      price: '',
      badge: 'Special Platter',
      image: '',
      imageAlt: '',
      imageStoragePath: '',
      order: current.specialPlattersItems.length + 1,
      status: 'Draft',
    }],
  }));
  const removeItem = (id) => setDraft((current) => ({
    ...current,
    specialPlattersItems: current.specialPlattersItems
      .filter((item) => item.id !== id)
      .map((item, index) => ({ ...item, order: index + 1 })),
  }));
  const moveItem = (id, direction) => setDraft((current) => {
    const index = current.specialPlattersItems.findIndex((item) => item.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= current.specialPlattersItems.length) return current;
    const items = [...current.specialPlattersItems];
    [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
    return { ...current, specialPlattersItems: items.map((item, order) => ({ ...item, order: order + 1 })) };
  });
  const uploadItemImage = async (event, itemId) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      notify('Choose a PNG, JPG, WebP, or AVIF image up to 5 MB.');
      input.value = '';
      return;
    }
    setUploadingItem(itemId);
    try {
      const uploaded = isSupabaseConfigured
        ? await uploadMediaFile(file, 'homepage/special-platters')
        : { url: await fileToDataUrl(file), path: '' };
      if (uploaded.error) throw uploaded.error;
      updateItem(itemId, { image: uploaded.url, imageStoragePath: uploaded.path || '' });
      notify(isSupabaseConfigured ? 'Platter image uploaded to Supabase Storage.' : 'Platter image added to the local preview.');
    } catch (error) {
      notify(`Platter image upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploadingItem('');
      input.value = '';
    }
  };

  const isComplete = (item) => Boolean(item.name.trim() && item.image.trim());
  const publishedItems = draft.specialPlattersItems.filter((item) => item.status === 'Published' && isComplete(item));
  const incompletePublishedItems = draft.specialPlattersItems.filter((item) => item.status === 'Published' && !isComplete(item));
  const save = async () => {
    const normalized = normalizeSpecialPlattersSettings(draft);
    const incompleteCount = normalized.specialPlattersItems.filter((item) => item.status === 'Published' && !isComplete(item)).length;
    const settings = {
      ...normalized,
      specialPlattersItems: normalized.specialPlattersItems.map((item) => (
        item.status === 'Published' && !isComplete(item) ? { ...item, status: 'Draft' } : item
      )),
    };
    setDraft(settings);
    setSaving(true);
    try {
      const result = await commit((current) => ({
        ...current,
        homepage: { ...current.homepage, ...settings },
      }));
      if (result?.contentOk === false) {
        notify(`Special Platters could not sync to Supabase: ${result.contentError?.message || 'database update failed'}`);
        return;
      }
      notify(incompleteCount
        ? `Published complete platters. ${incompleteCount} incomplete ${incompleteCount === 1 ? 'card was' : 'cards were'} kept as Draft.`
        : 'Naseeb Special Platters synced and published successfully.');
    } catch (error) {
      notify(`Special Platters could not be published: ${error.message || 'unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return <section className="admin-content-page admin-special-platters-page">
    <div className="admin-editor-grid">
      <div className="admin-editor-main">
        <div className="admin-panel admin-form-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-panel-kicker">Homepage carousel</span>
              <h2>Naseeb Special Platters</h2>
              <p>This is a separate collection. Add each platter and its own image here without using menu categories.</p>
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
              <label>Button label
                <input value={draft.specialPlattersButtonLabel || ''} onChange={(event) => update('specialPlattersButtonLabel', event.target.value)} placeholder="Explore Platters" />
              </label>
              <label>Autoplay speed (milliseconds)
                <input type="number" min="3000" max="12000" step="100" value={draft.specialPlattersSpeed ?? 5800} onChange={(event) => update('specialPlattersSpeed', event.target.value)} />
              </label>
            </div>
            <div className="admin-two-col">
              <label className="admin-switch-row">
                <input type="checkbox" checked={draft.showSpecialPlatters !== false} onChange={(event) => update('showSpecialPlatters', event.target.checked)} />
                <span className="admin-switch" />
                <span>Show section on homepage</span>
              </label>
              <label className="admin-switch-row">
                <input type="checkbox" checked={draft.specialPlattersAutoplay !== false} onChange={(event) => update('specialPlattersAutoplay', event.target.checked)} />
                <span className="admin-switch" />
                <span>Enable carousel autoplay</span>
              </label>
            </div>
          </div>
        </div>

        <div className="admin-panel admin-form-panel admin-special-platter-editor">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-panel-kicker">Separate platter content</span>
              <h2>Platter cards</h2>
              <p>Add a different photo, title, description, price, and publishing status for every carousel card.</p>
            </div>
            <button className="admin-primary-button" type="button" onClick={addItem}><Plus size={15} />Add Platter</button>
          </div>

          <div className="admin-special-platter-list">
            {draft.specialPlattersItems.map((item, index) => <article className="admin-special-platter-card" key={item.id}>
              <div className="admin-special-platter-card-head">
                <div><span className="admin-panel-kicker">Platter {index + 1}</span><strong>{item.name || 'Untitled platter'}</strong></div>
                <div className="admin-hero-slide-actions">
                  <button className="admin-icon-button small" type="button" aria-label={`Move platter ${index + 1} up`} title="Move up" onClick={() => moveItem(item.id, -1)} disabled={index === 0}><ChevronDown className="admin-chevron-up" size={15} /></button>
                  <button className="admin-icon-button small" type="button" aria-label={`Move platter ${index + 1} down`} title="Move down" onClick={() => moveItem(item.id, 1)} disabled={index === draft.specialPlattersItems.length - 1}><ChevronDown size={15} /></button>
                  <button className="admin-icon-button small admin-media-delete" type="button" aria-label={`Delete platter ${index + 1}`} title="Delete platter" onClick={() => removeItem(item.id)}><Trash2 size={15} /></button>
                </div>
              </div>
              <div className="admin-special-platter-layout">
                <div className="admin-special-platter-media">
                  <img src={item.image || '/naseeb-chapati-logo.png'} alt={item.imageAlt || item.name || 'Platter preview'} />
                  <label className="admin-outline-button admin-special-platter-upload"><Upload size={14} />{uploadingItem === item.id ? 'Uploading…' : 'Upload platter image'}
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => uploadItemImage(event, item.id)} disabled={Boolean(uploadingItem)} />
                  </label>
                  <small>Upload a unique image for this platter. Maximum 5 MB.</small>
                </div>
                <div className="admin-form admin-editor-form admin-special-platter-fields">
                  <div className="admin-two-col">
                    <label>Platter name<input value={item.name || ''} onChange={(event) => updateItem(item.id, { name: event.target.value })} placeholder="Family sharing platter" /></label>
                    <label>Badge<input value={item.badge || ''} onChange={(event) => updateItem(item.id, { badge: event.target.value })} placeholder="Best Seller" /></label>
                  </div>
                  <label>Description<textarea rows="3" value={item.description || ''} onChange={(event) => updateItem(item.id, { description: event.target.value })} placeholder="Describe what makes this platter special." /></label>
                  <label>Image URL<input value={item.image || ''} onChange={(event) => updateItem(item.id, { image: event.target.value })} placeholder="Upload an image or paste a URL" /></label>
                  <label>Image alt text<input value={item.imageAlt || ''} onChange={(event) => updateItem(item.id, { imageAlt: event.target.value })} placeholder="Describe the platter image" /></label>
                  <div className="admin-special-platter-meta">
                    <label>Price (RM)<input type="number" min="0" step="0.01" value={item.price ?? ''} onChange={(event) => updateItem(item.id, { price: event.target.value })} placeholder="0.00" /></label>
                    <label>Display order<input type="number" min="1" value={item.order || index + 1} onChange={(event) => updateItem(item.id, { order: event.target.value })} /></label>
                    <label>Status<select value={item.status || 'Draft'} onChange={(event) => updateItem(item.id, { status: event.target.value })}><option>Draft</option><option>Published</option><option>Archived</option></select></label>
                  </div>
                  {item.status === 'Published' && !isComplete(item) ? <div className="admin-form-error" role="alert"><CircleAlert size={15} />Add both a platter name and image before publishing. This card will remain Draft.</div> : null}
                </div>
              </div>
            </article>)}
            {!draft.specialPlattersItems.length ? <div className="admin-special-platter-empty"><Utensils size={22} /><strong>No platters added yet</strong><span>Select Add Platter to create the first independent carousel card.</span></div> : null}
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
            <img src={publishedItems[0]?.image || draft.specialPlattersItems[0]?.image || '/naseeb-chapati-logo.png'} alt="Special platter section preview" />
            <span>{draft.specialPlattersEyebrow || 'Made to share'}</span>
            <h3>{draft.specialPlattersTitle || 'Naseeb Special Platters'}</h3>
          </div>
          <div className="admin-field-summary">
            <strong>{publishedItems.length} ready platter {publishedItems.length === 1 ? 'card' : 'cards'}</strong>
            <small>{incompletePublishedItems.length ? `${incompletePublishedItems.length} incomplete published ${incompletePublishedItems.length === 1 ? 'card needs' : 'cards need'} a name and image.` : 'Complete cards marked Published appear on the homepage.'}</small>
          </div>
          <div className="admin-platter-preview-list">
            {draft.specialPlattersItems.slice(0, 4).map((item) => <div key={item.id}>
              <img src={item.image || '/naseeb-chapati-logo.png'} alt="" />
              <span><strong>{item.name || 'Untitled platter'}</strong><small>{item.status}</small></span>
            </div>)}
            {!draft.specialPlattersItems.length ? <p>Add platter cards to preview them here.</p> : null}
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="admin-outline-button">Preview homepage <ArrowUpRight size={15} /></a>
        </div>
        <button className="admin-primary-button admin-save-wide" type="button" onClick={save} disabled={saving}><Save size={16} />{saving ? 'Publishing to Supabase…' : 'Publish Special Platters'}</button>
      </aside>
    </div>
  </section>;
}

export default SpecialPlattersPage;
