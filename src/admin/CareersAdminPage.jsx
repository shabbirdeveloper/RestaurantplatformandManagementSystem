import { useEffect, useMemo, useState } from 'react';
import { Archive, BriefcaseBusiness, ExternalLink, GripVertical, ImagePlus, LoaderCircle, Pencil, Plus, Save, Search, Trash2, Upload, X } from 'lucide-react';
import {
  createCareerSlug, deleteCareerRoles, listAdminCareerRoles, reorderCareerRoles,
  saveCareerRole, updateCareerRoles, uploadMediaFile,
} from '../lib/supabase';
import './teamMembers.css';
import './careersAdmin.css';

const emptyRole = {
  title: '', slug: '', short_description: '', full_description: '', image: '', image_alt: '',
  location: '', employment_type: 'Full-time', department: '', requirements: [], contact_email: '',
  display_order: 0, featured: false, status: 'Draft',
};

function Status({ value }) {
  return <span className={`team-admin-status is-${String(value || 'draft').toLowerCase()}`}><i />{value || 'Draft'}</span>;
}

function Editor({ role, onClose, onSaved, notify }) {
  const [draft, setDraft] = useState({ ...emptyRole, ...role, requirements: role.requirements || [] });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const updateTitle = (value) => setDraft((current) => {
    const previousAutoSlug = createCareerSlug(current.title);
    return { ...current, title: value, slug: !current.slug || current.slug === previousAutoSlug ? createCareerSlug(value) : current.slug };
  });
  const upload = async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) { setError('Choose a PNG, JPG, WebP, or AVIF image up to 5 MB.'); input.value = ''; return; }
    setUploading(true); setError('');
    const result = await uploadMediaFile(file, 'careers/roles');
    setUploading(false); input.value = '';
    if (result.error) { setError(`Upload failed: ${result.error.message}`); return; }
    update('image', result.url);
    notify('Career image uploaded. Save the role to publish the change.');
  };
  const submit = async (event) => {
    event.preventDefault();
    const slug = createCareerSlug(draft.slug || draft.title);
    if (!draft.title.trim() || !draft.short_description.trim() || !slug) { setError('Role title, slug, and short description are required.'); return; }
    setSaving(true); setError('');
    const { data, error: saveError } = await saveCareerRole({ ...draft, slug });
    setSaving(false);
    if (saveError) { setError(saveError.code === '23505' ? 'That role URL is already in use.' : saveError.message); return; }
    onSaved(data);
  };
  return <div className="team-admin-drawer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <aside className="team-admin-drawer career-admin-drawer" role="dialog" aria-modal="true" aria-labelledby="career-editor-title">
      <header><div><span className="admin-eyebrow">{draft.id ? 'Edit opening' : 'Create opening'}</span><h2 id="career-editor-title">{draft.title || 'New Career Role'}</h2></div><button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close career editor"><X size={18} /></button></header>
      <form onSubmit={submit}>
        {error && <div className="team-admin-error" role="alert">{error}</div>}
        <section className="team-admin-editor-section"><div><span>Role image</span><h3>Relevant photography</h3></div>
          <label className="team-admin-image-upload career-admin-image-upload"><span>{draft.image ? <img src={draft.image} alt="" /> : <ImagePlus size={28} />}</span><strong>Vacancy Photo</strong><small>{uploading ? 'Uploading...' : 'PNG, JPG, WebP or AVIF'}</small><em><Upload size={13} />Choose image</em><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={upload} disabled={uploading} /></label>
          <label>Image Alt<input value={draft.image_alt || ''} onChange={(event) => update('image_alt', event.target.value)} placeholder="Describe the role image" /></label>
        </section>
        <section className="team-admin-editor-section"><div><span>Vacancy</span><h3>Role details</h3></div>
          <div className="team-admin-two-col">
            <label>Role Title *<input value={draft.title} onChange={(event) => updateTitle(event.target.value)} required /></label>
            <label>Slug *<div className="team-admin-slug"><span>/careers/</span><input value={draft.slug} onChange={(event) => update('slug', createCareerSlug(event.target.value))} required /></div></label>
            <label>Department<input value={draft.department || ''} onChange={(event) => update('department', event.target.value)} placeholder="Service or Kitchen" /></label>
            <label>Employment Type<select value={draft.employment_type || 'Full-time'} onChange={(event) => update('employment_type', event.target.value)}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Flexible</option></select></label>
            <label>Location<input value={draft.location || ''} onChange={(event) => update('location', event.target.value)} placeholder="Branch or All branches" /></label>
            <label>Display Order<input type="number" min="0" value={draft.display_order} onChange={(event) => update('display_order', Number(event.target.value))} /></label>
            <label>Status<select value={draft.status} onChange={(event) => update('status', event.target.value)}><option>Draft</option><option>Published</option><option>Archived</option></select></label>
            <label>Applications Email<input type="email" value={draft.contact_email || ''} onChange={(event) => update('contact_email', event.target.value)} placeholder="Uses main email if empty" /></label>
          </div>
          <label>Short Description *<textarea rows="3" value={draft.short_description} onChange={(event) => update('short_description', event.target.value)} required /></label>
          <label>Full Description<textarea rows="6" value={draft.full_description || ''} onChange={(event) => update('full_description', event.target.value)} /></label>
          <label>Requirements<textarea rows="5" value={(draft.requirements || []).join('\n')} onChange={(event) => update('requirements', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} placeholder="One requirement per line" /></label>
          <label className="team-admin-featured"><input type="checkbox" checked={Boolean(draft.featured)} onChange={(event) => update('featured', event.target.checked)} /><span /><div><strong>Featured opening</strong><small>Featured roles appear first and can supply the Careers hero image.</small></div></label>
        </section>
        <footer><button type="button" className="admin-outline-button" onClick={onClose}>Cancel</button>{draft.id && <a className="admin-outline-button" href="/careers" target="_blank" rel="noreferrer"><ExternalLink size={14} />Preview</a>}<button className="admin-primary-button" type="submit" disabled={saving || uploading}><Save size={15} />{saving ? 'Saving...' : 'Save Career Role'}</button></footer>
      </form>
    </aside>
  </div>;
}

export default function CareersAdminPage({ notify }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [sort, setSort] = useState('display_order');
  const [selected, setSelected] = useState([]);
  const [editor, setEditor] = useState(null);
  const [working, setWorking] = useState(false);
  const [dragging, setDragging] = useState('');
  const load = async () => { setLoading(true); setError(''); const result = await listAdminCareerRoles(); setLoading(false); if (result.error) setError(result.error.message); else setRoles(result.data || []); };
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => roles.filter((role) => (!query.trim() || `${role.title} ${role.department || ''} ${role.location || ''}`.toLowerCase().includes(query.trim().toLowerCase())) && (status === 'All statuses' || role.status === status)).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'updated' ? new Date(b.updated_at || 0) - new Date(a.updated_at || 0) : a.display_order - b.display_order), [roles, query, status, sort]);
  const allSelected = filtered.length > 0 && filtered.every((role) => selected.includes(role.id));
  const saveLocal = (role) => { setRoles((current) => current.some((item) => item.id === role.id) ? current.map((item) => item.id === role.id ? role : item) : [...current, role]); setEditor(null); notify(`${role.title} saved.`); };
  const changeStatus = async (nextStatus) => { if (!selected.length) return; setWorking(true); const result = await updateCareerRoles(selected, { status: nextStatus }); setWorking(false); if (result.error) { setError(result.error.message); return; } setRoles((current) => current.map((item) => selected.includes(item.id) ? { ...item, status: nextStatus } : item)); setSelected([]); notify(`${nextStatus} ${selected.length} career opening${selected.length === 1 ? '' : 's'}.`); };
  const remove = async (ids) => { if (!ids.length || !window.confirm(`Delete ${ids.length} career opening${ids.length === 1 ? '' : 's'}?`)) return; setWorking(true); const result = await deleteCareerRoles(ids); setWorking(false); if (result.error) { setError(result.error.message); return; } setRoles((current) => current.filter((item) => !ids.includes(item.id))); setSelected((current) => current.filter((id) => !ids.includes(id))); notify('Career opening deleted.'); };
  const dropOn = async (targetId) => { if (!dragging || dragging === targetId || sort !== 'display_order') return; const sourceIndex = roles.findIndex((item) => item.id === dragging); const targetIndex = roles.findIndex((item) => item.id === targetId); const next = [...roles]; const [moved] = next.splice(sourceIndex, 1); next.splice(targetIndex, 0, moved); const ordered = next.map((item, index) => ({ ...item, display_order: index })); setRoles(ordered); setDragging(''); const result = await reorderCareerRoles(ordered); if (result.error) { setError(result.error.message); void load(); } else notify('Career display order updated.'); };
  return <div className="team-admin-page career-admin-page">
    <div className="team-admin-commandbar"><label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search career openings..." /></label><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Published</option><option>Draft</option><option>Archived</option></select><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="display_order">Display order</option><option value="title">Role title</option><option value="updated">Recently updated</option></select><button type="button" className="admin-outline-button" onClick={load}><LoaderCircle size={15} className={loading ? 'is-spinning' : ''} />Refresh</button><button className="admin-primary-button" type="button" onClick={() => setEditor({ ...emptyRole, display_order: roles.length })}><Plus size={16} />Add Career Role</button></div>
    {selected.length > 0 && <div className="team-admin-bulk"><strong>{selected.length} selected</strong><button type="button" onClick={() => changeStatus('Published')}>Publish</button><button type="button" onClick={() => changeStatus('Draft')}>Move to draft</button><button type="button" onClick={() => changeStatus('Archived')}><Archive size={14} />Archive</button><button type="button" className="danger" onClick={() => remove(selected)}><Trash2 size={14} />Delete</button><button type="button" onClick={() => setSelected([])}><X size={14} />Clear</button></div>}
    {error && <div className="team-admin-error" role="alert">{error}<button type="button" onClick={load}>Try again</button></div>}
    {loading && <div className="team-admin-loading"><LoaderCircle size={24} className="is-spinning" /><span>Loading career openings...</span></div>}
    {!loading && !error && filtered.length === 0 && <div className="team-admin-empty"><BriefcaseBusiness size={28} /><h3>{roles.length ? 'No openings match these filters.' : 'No career openings yet.'}</h3><p>Add and publish Waiters / Waitresses, Cashier, Cook, or future vacancies.</p><button className="admin-primary-button" type="button" onClick={() => setEditor({ ...emptyRole, display_order: roles.length })}><Plus size={15} />Add Career Role</button></div>}
    {!loading && !error && filtered.length > 0 && <div className="team-admin-table-wrap"><table className="team-admin-table"><thead><tr><th><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : filtered.map((role) => role.id))} aria-label="Select all openings" /></th><th>Order</th><th>Opening</th><th>Department</th><th>Location</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{filtered.map((role) => <tr key={role.id} draggable={sort === 'display_order'} onDragStart={() => setDragging(role.id)} onDragEnd={() => setDragging('')} onDragOver={(event) => event.preventDefault()} onDrop={() => dropOn(role.id)}><td><input type="checkbox" checked={selected.includes(role.id)} onChange={() => setSelected((current) => current.includes(role.id) ? current.filter((id) => id !== role.id) : [...current, role.id])} aria-label={`Select ${role.title}`} /></td><td><span className="team-admin-drag"><GripVertical size={16} />{role.display_order + 1}</span></td><td><div className="team-admin-person career-admin-role"><span>{role.image ? <img src={role.image} alt="" /> : <BriefcaseBusiness size={17} />}</span><div><strong>{role.title}</strong><small>/careers · {role.employment_type || 'Type not set'}</small></div></div></td><td>{role.department || '—'}</td><td>{role.location || 'All branches'}</td><td><Status value={role.status} />{role.featured && <small className="team-admin-featured-tag">Featured</small>}</td><td><div className="team-admin-row-actions"><a href="/careers" target="_blank" rel="noreferrer" aria-label={`Preview ${role.title}`}><ExternalLink size={15} /></a><button type="button" onClick={() => setEditor(role)} aria-label={`Edit ${role.title}`}><Pencil size={15} /></button><button type="button" onClick={() => remove([role.id])} aria-label={`Delete ${role.title}`}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>}
    {working && <div className="career-admin-working"><LoaderCircle size={18} className="is-spinning" />Updating openings...</div>}
    {editor && <Editor role={editor} onClose={() => setEditor(null)} onSaved={saveLocal} notify={notify} />}
  </div>;
}
