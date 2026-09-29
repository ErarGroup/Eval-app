import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRESET_STRENGTHS, PRESET_GROWTH, PRESET_VIDEOS } from './presets';

export default function Director() {
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [targets, setTargets] = useState({
    mindsetAvg: 3.0, physicalAvg: 3.0, technicalAvg: 3.0, tacticalAvg: 3.0
  });
  
  const [teamName, setTeamName] = useState('');
  const [teamTargets, setTeamTargets] = useState({
    mindsetAvg: 3.0, physicalAvg: 3.0, technicalAvg: 3.0, tacticalAvg: 3.0
  });

  const [saving, setSaving] = useState(false);
  const [savingTeam, setSavingTeam] = useState(false);
  
  const [roster, setRoster] = useState<any[]>([]);
  const [allTeamTargets, setAllTeamTargets] = useState<any[]>([]);

  // Preset manager state
  const [dbPresets, setDbPresets] = useState<any>(null);
  const [presetCategory, setPresetCategory] = useState<'strengths'|'growth'|'videos'>('strengths');
  const [presetPillar, setPresetPillar] = useState('mindset');
  const [presetLevel, setPresetLevel] = useState('advanced');
  const [presetVideoType, setPresetVideoType] = useState<'strength'|'growth'>('strength');
  const [newItemText, setNewItemText] = useState('');
  const [savingPresets, setSavingPresets] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    if (!auth) return; // Don't fetch unless logged in

    fetch('/api/roster')
      .then(res => res.json())
      .then(data => { if(data) setRoster(data); })
      .catch(console.error);

    fetch('/api/evaluations')
      .then(res => res.json())
      .then(data => setEvaluations(data))
      .catch(console.error);

    fetch('/api/targets')
      .then(res => res.json())
      .then(data => {
        if(data) setTargets({
          mindsetAvg: data.mindsetAvg || 3.0,
          physicalAvg: data.physicalAvg || 3.0,
          technicalAvg: data.technicalAvg || 3.0,
          tacticalAvg: data.tacticalAvg || 3.0
        });
      })
      .catch(console.error);

    fetch('/api/team-targets')
      .then(res => res.json())
      .then(data => { if(data) setAllTeamTargets(data); })
      .catch(console.error);

    fetch('/api/presets')
      .then(res => res.json())
      .then(data => {
        if (data) setDbPresets(data);
      })
      .catch(console.error);
  }, [auth]);

  // Pre-fill metrics dynamically based on the Dropdown selection
  useEffect(() => {
    if (teamName) {
      const existing = allTeamTargets.find(t => t.teamName === teamName.toLowerCase());
      if (existing) {
        setTeamTargets({
          mindsetAvg: existing.mindsetAvg,
          physicalAvg: existing.physicalAvg,
          technicalAvg: existing.technicalAvg,
          tacticalAvg: existing.tacticalAvg
        });
      } else {
        // Reset to default if no explicit memory for this team exists yet
        setTeamTargets({mindsetAvg: 3.0, physicalAvg: 3.0, technicalAvg: 3.0, tacticalAvg: 3.0});
      }
    }
  }, [teamName, allTeamTargets]);

  // Preset manager helpers
  const getCurrentList = (): string[] => {
    if (!dbPresets) return [];
    if (presetCategory === 'videos') {
      return dbPresets?.videos?.[presetPillar]?.[presetLevel]?.[presetVideoType] || [];
    }
    return dbPresets?.[presetCategory]?.[presetPillar]?.[presetLevel] || [];
  };

  const updateCurrentList = (newList: string[]) => {
    setDbPresets((prev: any) => {
      const updated = JSON.parse(JSON.stringify(prev || {}));
      if (presetCategory === 'videos') {
        if (!updated.videos) updated.videos = {};
        if (!updated.videos[presetPillar]) updated.videos[presetPillar] = {};
        if (!updated.videos[presetPillar][presetLevel]) updated.videos[presetPillar][presetLevel] = {};
        updated.videos[presetPillar][presetLevel][presetVideoType] = newList;
      } else {
        if (!updated[presetCategory]) updated[presetCategory] = {};
        if (!updated[presetCategory][presetPillar]) updated[presetCategory][presetPillar] = {};
        updated[presetCategory][presetPillar][presetLevel] = newList;
      }
      return updated;
    });
  };

  const addItem = () => {
    const trimmed = newItemText.trim();
    if (!trimmed) return;
    const current = getCurrentList();
    if (current.includes(trimmed)) { alert('Item already exists.'); return; }
    updateCurrentList([...current, trimmed]);
    setNewItemText('');
  };

  const removeItem = (item: string) => {
    updateCurrentList(getCurrentList().filter(i => i !== item));
  };

  const initializeFromDefaults = () => {
    setDbPresets({
      strengths: PRESET_STRENGTHS,
      growth: PRESET_GROWTH,
      videos: PRESET_VIDEOS
    });
  };

  const savePresets = async () => {
    if (!dbPresets) { alert('Please initialize from defaults first.'); return; }
    setSavingPresets(true);
    try {
      await fetch('/api/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbPresets)
      });
      alert('Dropdown lists saved successfully!');
    } catch(err) {
      alert('Failed to save. Backend may be offline.');
    }
    setSavingPresets(false);
  };

  if (!auth) {
    return (
      <div className="container" style={{display: 'flex', justifyContent: 'center', minHeight: '80vh', alignItems: 'center'}}>
         <div className="card animate-slide-in" style={{width: '100%', maxWidth: '400px', textAlign: 'center'}}>
           <h2 className="section-title" style={{justifyContent: 'center'}}>Director Secure Access</h2>
           <p style={{ opacity: 0.8, marginBottom: '1.5rem', fontSize: '0.9rem' }}>Please enter your DYSC Director credentials to access the internal control dashboard.</p>
           <input type="email" placeholder="Director Email" style={{marginBottom: '1rem'}} value={email} onChange={e=>setEmail(e.target.value)} />
           <input type="password" placeholder="Dashboard Password" style={{marginBottom: '1rem'}} value={password} onChange={e=>setPassword(e.target.value)} />
           <button className="btn-primary" onClick={() => {
              if (email === 'dos@deltonasoccer.com' && password === 'DYSCpass') {
                 setAuth(true);
              } else {
                 alert('Invalid Credentials. Access Denied.');
              }
           }}>
             Log In
           </button>
           <Link to="/" style={{ display: 'block', marginTop: '1.5rem', color: 'var(--text-color)', opacity: 0.7, fontSize: '0.9rem' }}>Return to Public Form</Link>
         </div>
      </div>
    );
  }

  const availableTeams = [...new Set(roster.map(r => r.team))].filter(Boolean).sort();

  const handleTargetChange = (field: string, value: string) => {
    setTargets(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };
  
  const handleTeamTargetChange = (field: string, value: string) => {
    setTeamTargets(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const saveTargets = async () => {
    setSaving(true);
    try {
      await fetch('/api/targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targets)
      });
      alert('Club Benchmarks updated successfully!');
    } catch(err) {
      console.error(err);
      alert('Failed to update targets. Backend may be offline.');
    }
    setSaving(false);
  };
  
  const saveTeamTargetsFetch = async () => {
    if(!teamName) {
      alert("Please select a team name first before setting its targets.");
      return;
    }
    setSavingTeam(true);
    try {
      const res = await fetch('/api/team-targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, ...teamTargets })
      });
      const newTarget = await res.json();
      
      // Update local state smoothly
      setAllTeamTargets(prev => {
        const filtered = prev.filter(t => t.teamName !== teamName.toLowerCase());
        return [...filtered, newTarget];
      });

      alert(`Team Benchmarks updated successfully for: ${teamName}`);
    } catch(err) {
      console.error(err);
      alert('Failed to update team targets.');
    }
    setSavingTeam(false);
  };

  const currentList = getCurrentList();

  return (
    <div className="container">
      <header className="header" style={{ marginBottom: '2rem' }}>
        <h1>Director <span className="gradient-text">Dashboard</span></h1>
        <p>Global Statistics, Baselines &amp; Past Evaluations Archive</p>
        <Link to="/" className="rating-btn" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', textDecoration: 'none' }}>
           Back to Form
        </Link>
      </header>

      <div className="card summary-card animate-slide-in">
        <h2 className="section-title">DYSC Club Target Averages</h2>
        <p style={{ opacity: 0.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
          Manually set and define the standard expectations across the club. These targets dictate the baseline for the current evaluation cycles.
        </p>
        <div className="averages-grid">
          <div className="average-box">
             <small>Mindset Target</small>
             <input type="number" step="0.1" min="0" max="4" value={targets.mindsetAvg} onChange={(e) => handleTargetChange('mindsetAvg', e.target.value)} style={{ background: 'transparent', border: 'none', color: '#ffb703', fontSize: '2rem', fontWeight: 800, textAlign: 'center', width: '100%', padding: '0' }} />
          </div>
          <div className="average-box">
             <small>Physical Target</small>
             <input type="number" step="0.1" min="0" max="4" value={targets.physicalAvg} onChange={(e) => handleTargetChange('physicalAvg', e.target.value)} style={{ background: 'transparent', border: 'none', color: '#ffb703', fontSize: '2rem', fontWeight: 800, textAlign: 'center', width: '100%', padding: '0' }} />
          </div>
          <div className="average-box">
             <small>Technical Target</small>
             <input type="number" step="0.1" min="0" max="4" value={targets.technicalAvg} onChange={(e) => handleTargetChange('technicalAvg', e.target.value)} style={{ background: 'transparent', border: 'none', color: '#ffb703', fontSize: '2rem', fontWeight: 800, textAlign: 'center', width: '100%', padding: '0' }} />
          </div>
          <div className="average-box">
             <small>Tactical Target</small>
             <input type="number" step="0.1" min="0" max="4" value={targets.tacticalAvg} onChange={(e) => handleTargetChange('tacticalAvg', e.target.value)} style={{ background: 'transparent', border: 'none', color: '#ffb703', fontSize: '2rem', fontWeight: 800, textAlign: 'center', width: '100%', padding: '0' }} />
          </div>
        </div>
        <button className="rating-btn active-3" style={{ marginTop: '1.5rem', width: '100%' }} onClick={saveTargets}>
          {saving ? 'Saving...' : 'Lock In DYSC Benchmark Targets'}
        </button>
      </div>

      <div className="card animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="section-title">Manual Team Benchmarks</h2>
        <p style={{ opacity: 0.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
          Select an exact Team Name from the Database to fetch or assign its manual evaluation metrics. 
        </p>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Assign to Team Name:</label>
          {availableTeams.length > 0 ? (
            <select value={teamName} onChange={e => setTeamName(e.target.value)} style={{ background: 'rgba(0,0,0,0.05)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}>
              <option value="">-- Select Team --</option>
              {availableTeams.map(team => <option key={team} value={team}>{team}</option>)}
            </select>
          ) : (
            <input type="text" placeholder="e.g. Sr. Team Neymar (Must match spelling)" value={teamName} onChange={e => setTeamName(e.target.value)} style={{ background: 'rgba(0,0,0,0.05)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }} />
          )}
        </div>
        
        <div className="averages-grid">
          <div className="average-box" style={{ background: 'rgba(0,0,0,0.05)'}}>
             <small style={{ color: 'var(--text-color)' }}>Mindset Target</small>
             <input type="number" step="0.1" min="0" max="4" value={teamTargets.mindsetAvg} onChange={(e) => handleTeamTargetChange('mindsetAvg', e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '2rem', fontWeight: 800, textAlign: 'center', width: '100%', padding: '0' }} />
          </div>
          <div className="average-box" style={{ background: 'rgba(0,0,0,0.05)'}}>
             <small style={{ color: 'var(--text-color)' }}>Physical Target</small>
             <input type="number" step="0.1" min="0" max="4" value={teamTargets.physicalAvg} onChange={(e) => handleTeamTargetChange('physicalAvg', e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '2rem', fontWeight: 800, textAlign: 'center', width: '100%', padding: '0' }} />
          </div>
          <div className="average-box" style={{ background: 'rgba(0,0,0,0.05)'}}>
             <small style={{ color: 'var(--text-color)' }}>Technical Target</small>
             <input type="number" step="0.1" min="0" max="4" value={teamTargets.technicalAvg} onChange={(e) => handleTeamTargetChange('technicalAvg', e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '2rem', fontWeight: 800, textAlign: 'center', width: '100%', padding: '0' }} />
          </div>
          <div className="average-box" style={{ background: 'rgba(0,0,0,0.05)'}}>
             <small style={{ color: 'var(--text-color)' }}>Tactical Target</small>
             <input type="number" step="0.1" min="0" max="4" value={teamTargets.tacticalAvg} onChange={(e) => handleTeamTargetChange('tacticalAvg', e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '2rem', fontWeight: 800, textAlign: 'center', width: '100%', padding: '0' }} />
          </div>
        </div>
        <button className="rating-btn active-2" style={{ marginTop: '1.5rem', width: '100%' }} onClick={saveTeamTargetsFetch}>
          {savingTeam ? 'Saving...' : 'Lock In Manual Team Targets'}
        </button>
      </div>

      {/* Manage Dropdown Lists */}
      <div className="card animate-slide-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="section-title">Manage Dropdown Lists</h2>
        <p style={{ opacity: 0.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
          Customize the Strengths, Areas for Growth, and Work on your own options shown to coaches in the evaluation form.
        </p>

        {!dbPresets ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ marginBottom: '1rem', opacity: 0.7 }}>No custom lists saved yet. Load the built-in defaults to start editing.</p>
            <button className="rating-btn active-3" onClick={initializeFromDefaults}>Load Default Lists</button>
          </div>
        ) : (
          <>
            {/* Selectors row */}
            <div className="grid" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label>Category</label>
                <select value={presetCategory} onChange={e => setPresetCategory(e.target.value as any)}>
                  <option value="strengths">Strengths</option>
                  <option value="growth">Areas for Growth</option>
                  <option value="videos">Work on your own</option>
                </select>
              </div>
              <div className="form-group">
                <label>Pillar</label>
                <select value={presetPillar} onChange={e => setPresetPillar(e.target.value)}>
                  <option value="mindset">Mindset</option>
                  <option value="physical">Physical</option>
                  <option value="technical">Technical</option>
                  <option value="tactical">Tactical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Level</label>
                <select value={presetLevel} onChange={e => setPresetLevel(e.target.value)}>
                  <option value="advanced">Advanced (Competitive)</option>
                  <option value="intermediate">Intermediate (Developmental)</option>
                  <option value="basic">Basic (Recreational)</option>
                </select>
              </div>
              {presetCategory === 'videos' && (
                <div className="form-group">
                  <label>Type</label>
                  <select value={presetVideoType} onChange={e => setPresetVideoType(e.target.value as any)}>
                    <option value="strength">Strength-Reinforcing</option>
                    <option value="growth">Growth-Focused</option>
                  </select>
                </div>
              )}
            </div>

            {/* Current items list */}
            <div style={{ marginBottom: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              {currentList.length === 0 ? (
                <p style={{ padding: '1rem', opacity: 0.6, margin: 0, textAlign: 'center' }}>No items yet. Add one below.</p>
              ) : (
                currentList.map((item, idx) => (
                  <div key={idx} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.65rem 1rem",
                    borderBottom: idx < currentList.length - 1 ? "1px solid var(--border-color)" : "none",
                    background: idx % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)"
                  }}>
                    {editingIdx === idx ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            const trimmed = editingText.trim();
                            if (trimmed && trimmed !== item) {
                              const updated = [...currentList];
                              updated[idx] = trimmed;
                              updateCurrentList(updated);
                            }
                            setEditingIdx(null);
                          }
                          if (e.key === "Escape") setEditingIdx(null);
                        }}
                        autoFocus
                        style={{ flex: 1, margin: 0, marginRight: "0.5rem", padding: "0.3rem 0.5rem", fontSize: "0.9rem" }}
                      />
                    ) : (
                      <span style={{ fontSize: "0.9rem", flex: 1 }}>{item}</span>
                    )}
                    <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                      {editingIdx === idx ? (
                        <>
                          <button
                            onClick={() => {
                              const trimmed = editingText.trim();
                              if (trimmed && trimmed !== item) {
                                const updated = [...currentList];
                                updated[idx] = trimmed;
                                updateCurrentList(updated);
                              }
                              setEditingIdx(null);
                            }}
                            style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)", color: "var(--score-4)", borderRadius: "4px", padding: "0.2rem 0.6rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingIdx(null)}
                            style={{ background: "rgba(0,0,0,0.06)", border: "1px solid var(--border-color)", color: "var(--text-color)", borderRadius: "4px", padding: "0.2rem 0.6rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditingIdx(idx); setEditingText(item); }}
                            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#3b82f6", borderRadius: "4px", padding: "0.2rem 0.6rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeItem(item)}
                            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--score-1)", borderRadius: "4px", padding: "0.2rem 0.6rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add new item */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                value={newItemText}
                onChange={e => setNewItemText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder="Type new option text and press Add..."
                style={{ flex: 1, margin: 0 }}
              />
              <button className="rating-btn active-4" onClick={addItem} style={{ whiteSpace: 'nowrap' }}>+ Add</button>
            </div>

            <button className="rating-btn active-3" style={{ width: '100%' }} onClick={savePresets}>
              {savingPresets ? 'Saving...' : 'Save All Changes to Database'}
            </button>
          </>
        )}
      </div>

      <div className="card animate-slide-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="section-title">Evaluations Archive</h2>
        {evaluations.length === 0 ? (
          <p>No evaluations submitted yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Player</th>
                  <th style={{ padding: '0.75rem' }}>Team</th>
                  <th style={{ padding: '0.75rem' }}>Coach</th>
                  <th style={{ padding: '0.75rem' }}>Mindset</th>
                  <th style={{ padding: '0.75rem' }}>Physical</th>
                  <th style={{ padding: '0.75rem' }}>Technical</th>
                  <th style={{ padding: '0.75rem' }}>Tactical</th>
                  <th style={{ padding: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((ev) => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: 0.9 }}>
                    <td style={{ padding: '0.75rem' }}>{ev.date}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{ev.playerName}</td>
                    <td style={{ padding: '0.75rem' }}>{ev.team}</td>
                    <td style={{ padding: '0.75rem' }}>{ev.coach || '\u2014'}</td>
                    <td style={{ padding: '0.75rem', color: ev.mindsetAvg >= targets.mindsetAvg ? 'var(--score-4)' : 'var(--score-2)' }}>{ev.mindsetAvg.toFixed(1)}</td>
                    <td style={{ padding: '0.75rem', color: ev.physicalAvg >= targets.physicalAvg ? 'var(--score-4)' : 'var(--score-2)' }}>{ev.physicalAvg.toFixed(1)}</td>
                    <td style={{ padding: '0.75rem', color: ev.technicalAvg >= targets.technicalAvg ? 'var(--score-4)' : 'var(--score-2)' }}>{ev.technicalAvg.toFixed(1)}</td>
                    <td style={{ padding: '0.75rem', color: ev.tacticalAvg >= targets.tacticalAvg ? 'var(--score-4)' : 'var(--score-2)' }}>{ev.tacticalAvg.toFixed(1)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <Link to={`/print/${ev.id}`} className="rating-btn active-4" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                        Print
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
