"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBars, FaUser, FaBriefcase, FaCode, FaSignOutAlt, FaTimes, FaHome } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'about', 'experience', 'projects'
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [tagInputs, setTagInputs] = useState({});

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      alert('Content saved successfully to MockAPI!');
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const updateHome = (field, value) => {
    setData({ ...data, home: { ...data.home, [field]: value } });
  };

  const updateAbout = (field, value) => {
    setData({ ...data, about: { ...data.about, [field]: value } });
  };

  const updateExperience = (index, field, value) => {
    const newItems = [...data.experience.items];
    newItems[index][field] = value;
    setData({ ...data, experience: { ...data.experience, items: newItems } });
  };

  const addExperience = () => {
    const newItems = [...data.experience.items, { role: '', company: '', duration: '', description: '', tags: [] }];
    setData({ ...data, experience: { ...data.experience, items: newItems } });
  };

  const deleteExperience = (index) => {
    const newItems = data.experience.items.filter((_, i) => i !== index);
    setData({ ...data, experience: { ...data.experience, items: newItems } });
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...data.projects];
    newProjects[index][field] = value;
    setData({ ...data, projects: newProjects });
  };

  const addProject = () => {
    const newProjects = [...data.projects, { title: '', description: '', link: '', tags: [] }];
    setData({ ...data, projects: newProjects });
  };

  const deleteProject = (index) => {
    const newProjects = data.projects.filter((_, i) => i !== index);
    setData({ ...data, projects: newProjects });
  };

  // Helper function to handle tag input
  const handleTagInput = (e, section, index) => {
    const value = e.target.value;
    const inputKey = `${section}-${index}`;
    
    // If user typed a comma or pressed enter
    if (value.endsWith(',') || e.key === 'Enter') {
      e.preventDefault();
      const newTag = value.replace(',', '').trim();
      
      if (newTag) {
        if (section === 'experience') {
          const newItems = [...data.experience.items];
          newItems[index].tags = [...(newItems[index].tags || []), newTag];
          setData({ ...data, experience: { ...data.experience, items: newItems } });
        } else if (section === 'projects') {
          const newProjects = [...data.projects];
          newProjects[index].tags = [...(newProjects[index].tags || []), newTag];
          setData({ ...data, projects: newProjects });
        }
      }
      setTagInputs({ ...tagInputs, [inputKey]: '' });
    } else {
      setTagInputs({ ...tagInputs, [inputKey]: value });
    }
  };

  const removeTag = (section, itemIndex, tagIndex) => {
    if (section === 'experience') {
      const newItems = [...data.experience.items];
      newItems[itemIndex].tags = newItems[itemIndex].tags.filter((_, i) => i !== tagIndex);
      setData({ ...data, experience: { ...data.experience, items: newItems } });
    } else if (section === 'projects') {
      const newProjects = [...data.projects];
      newProjects[itemIndex].tags = newProjects[itemIndex].tags.filter((_, i) => i !== tagIndex);
      setData({ ...data, projects: newProjects });
    }
  };

  // Helper for Duration Date Picker logic
  const handleDateChange = (index, type, value) => {
    const exp = data.experience.items[index];
    let currentDuration = exp.duration || '';
    
    // Try to parse existing "start - end"
    let [start = '', end = ''] = currentDuration.split(' - ');
    if (currentDuration === '') {
       start = '';
       end = '';
    }

    // Convert YYYY-MM back to Month Year if needed, but for simplicity, we can just save YYYY-MM
    // The user wants a date picker, so YYYY-MM is fine to store directly.
    if (type === 'start') start = value;
    if (type === 'end') end = value;
    
    // If end is empty string, it's "Present"
    let newDuration = `${start} - ${end ? end : 'Present'}`;
    if (!start && !end) newDuration = '';

    updateExperience(index, 'duration', newDuration);
  };


  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Admin Panel...</div>;
  if (!data) return <div className="container">Error loading data.</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      
      {/* Expanding Sidebar */}
      <div className="glass-panel" style={{ 
        width: isSidebarExpanded ? '250px' : '80px', 
        transition: 'width 0.3s ease',
        flexShrink: 0,
        borderRadius: 0,
        borderRight: '1px solid var(--glass-border)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSidebarExpanded ? 'stretch' : 'center',
        padding: isSidebarExpanded ? '2rem 1rem' : '2rem 0'
      }}>
        
        <button 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-primary)', 
            cursor: 'pointer',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
            padding: '0 1rem',
            width: '100%'
          }}
        >
          <FaBars size={24} />
          {isSidebarExpanded && <span style={{ marginLeft: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Admin</span>}
        </button>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          <li>
            <button 
              onClick={() => setActiveTab('home')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
                padding: '12px 1rem', 
                background: activeTab === 'home' ? 'rgba(99, 102, 241, 0.2)' : 'transparent', 
                border: 'none', 
                color: activeTab === 'home' ? '#fff' : 'var(--text-secondary)', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease' 
              }}
              title="Home"
            >
              <FaHome size={20} />
              {isSidebarExpanded && <span style={{ marginLeft: '1rem', fontWeight: activeTab === 'home' ? '600' : '400' }}>Home</span>}
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('about')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
                padding: '12px 1rem', 
                background: activeTab === 'about' ? 'rgba(99, 102, 241, 0.2)' : 'transparent', 
                border: 'none', 
                color: activeTab === 'about' ? '#fff' : 'var(--text-secondary)', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease' 
              }}
              title="About Me"
            >
              <FaUser size={20} />
              {isSidebarExpanded && <span style={{ marginLeft: '1rem', fontWeight: activeTab === 'about' ? '600' : '400' }}>About Me</span>}
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('experience')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
                padding: '12px 1rem', 
                background: activeTab === 'experience' ? 'rgba(99, 102, 241, 0.2)' : 'transparent', 
                border: 'none', 
                color: activeTab === 'experience' ? '#fff' : 'var(--text-secondary)', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease' 
              }}
              title="Work Experience"
            >
              <FaBriefcase size={20} />
              {isSidebarExpanded && <span style={{ marginLeft: '1rem', fontWeight: activeTab === 'experience' ? '600' : '400' }}>Experience</span>}
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('projects')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
                padding: '12px 1rem', 
                background: activeTab === 'projects' ? 'rgba(99, 102, 241, 0.2)' : 'transparent', 
                border: 'none', 
                color: activeTab === 'projects' ? '#fff' : 'var(--text-secondary)', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease' 
              }}
              title="Projects"
            >
              <FaCode size={20} />
              {isSidebarExpanded && <span style={{ marginLeft: '1rem', fontWeight: activeTab === 'projects' ? '600' : '400' }}>Projects</span>}
            </button>
          </li>
        </ul>

        {/* Logout Button */}
        <div style={{ marginTop: 'auto', width: '100%' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
              padding: '12px 1rem', 
              background: 'transparent', 
              border: 'none', 
              color: '#ef4444', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease' 
            }}
            title="Logout"
          >
            <FaSignOutAlt size={20} />
            {isSidebarExpanded && <span style={{ marginLeft: '1rem', fontWeight: '500' }}>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, padding: '2rem 4rem', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto', transition: 'padding 0.3s ease' }}>
        <h1 className="section-title" style={{ marginBottom: '1rem' }}>Dashboard</h1>
        {error && <div style={{ background: '#ef444433', color: '#fca5a5', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #ef4444' }}>{error}</div>}
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Edit your portfolio content below. Changes are saved directly to MockAPI.</p>

        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3>Home / Hero Section</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <label>
                <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Greeting (e.g. "Hello, I am"):</span>
                <input className="glass-input" value={data.home?.greeting || ''} onChange={e => updateHome('greeting', e.target.value)} />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Your Name:</span>
                <input className="glass-input" value={data.home?.name || ''} onChange={e => updateHome('name', e.target.value)} />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Role / Title:</span>
                <input className="glass-input" value={data.home?.role || ''} onChange={e => updateHome('role', e.target.value)} />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Bio / Tagline:</span>
                <textarea className="glass-input" rows="3" value={data.home?.bio || ''} onChange={e => updateHome('bio', e.target.value)} />
              </label>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3>About Me</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <label>
                <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Title:</span>
                <input className="glass-input" value={data.about.title || ''} onChange={e => updateAbout('title', e.target.value)} />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Content:</span>
                <textarea className="glass-input" rows="5" value={data.about.content || ''} onChange={e => updateAbout('content', e.target.value)} />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Skills (comma separated):</span>
                <input className="glass-input" value={data.about.skills?.join(', ') || ''} onChange={e => updateAbout('skills', e.target.value.split(',').map(s => s.trim()))} />
              </label>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3>Work Experience</h3>
              <button onClick={addExperience} className="glass-button" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add Experience</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {data.experience.items.map((exp, i) => {
                const [start = '', end = ''] = (exp.duration || '').split(' - ');
                return (
                  <div key={i} style={{ border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                      <h4 style={{ color: 'var(--accent-color)' }}>Experience #{i + 1}</h4>
                      <button onClick={() => deleteExperience(i)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <label>
                        <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Role</span>
                        <input className="glass-input" placeholder="Role" value={exp.role || ''} onChange={e => updateExperience(i, 'role', e.target.value)} />
                      </label>
                      <label>
                        <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Company</span>
                        <input className="glass-input" placeholder="Company" value={exp.company || ''} onChange={e => updateExperience(i, 'company', e.target.value)} />
                      </label>
                      
                      {/* Date Picker Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <label>
                          <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Start Date</span>
                          <input type="month" className="glass-input" value={start} onChange={e => handleDateChange(i, 'start', e.target.value)} />
                        </label>
                        <label>
                          <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>End Date (Leave blank for Present)</span>
                          <input type="month" className="glass-input" value={end === 'Present' ? '' : end} onChange={e => handleDateChange(i, 'end', e.target.value)} />
                        </label>
                      </div>

                      <label>
                        <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Description</span>
                        <textarea className="glass-input" placeholder="Description" rows="3" value={exp.description || ''} onChange={e => updateExperience(i, 'description', e.target.value)} />
                      </label>
                      
                      {/* Tag Badge UI */}
                      <div>
                        <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tags (Type comma or enter to add)</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                          {exp.tags?.map((tag, tIndex) => (
                            <span key={tIndex} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px', fontSize: '0.85rem', color: '#fff' }}>
                              {tag}
                              <FaTimes style={{ cursor: 'pointer', color: '#fca5a5' }} onClick={() => removeTag('experience', i, tIndex)} />
                            </span>
                          ))}
                        </div>
                        <input 
                          className="glass-input" 
                          placeholder="Add a tag..." 
                          value={tagInputs[`experience-${i}`] || ''} 
                          onChange={(e) => handleTagInput(e, 'experience', i)}
                          onKeyDown={(e) => handleTagInput(e, 'experience', i)}
                        />
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3>Projects</h3>
              <button onClick={addProject} className="glass-button" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add Project</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {data.projects.map((proj, i) => (
                <div key={i} style={{ border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <h4 style={{ color: 'var(--accent-color)' }}>Project #{i + 1}</h4>
                    <button onClick={() => deleteProject(i)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className="glass-input" placeholder="Project Title" value={proj.title || ''} onChange={e => updateProject(i, 'title', e.target.value)} />
                    <input className="glass-input" placeholder="Project Link" value={proj.link || ''} onChange={e => updateProject(i, 'link', e.target.value)} />
                    <textarea className="glass-input" placeholder="Description" rows="3" value={proj.description || ''} onChange={e => updateProject(i, 'description', e.target.value)} />
                    
                    {/* Tag Badge UI */}
                    <div>
                      <span style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tags</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                        {proj.tags?.map((tag, tIndex) => (
                          <span key={tIndex} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px', fontSize: '0.85rem', color: '#fff' }}>
                            {tag}
                            <FaTimes style={{ cursor: 'pointer', color: '#fca5a5' }} onClick={() => removeTag('projects', i, tIndex)} />
                          </span>
                        ))}
                      </div>
                      <input 
                        className="glass-input" 
                        placeholder="Add a tag (comma to save)..." 
                        value={tagInputs[`projects-${i}`] || ''} 
                        onChange={(e) => handleTagInput(e, 'projects', i)}
                        onKeyDown={(e) => handleTagInput(e, 'projects', i)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Sticky Save Footer */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: isSidebarExpanded ? '250px' : '80px', 
        right: 0, 
        padding: '1rem 4rem', 
        background: 'rgba(5, 5, 15, 0.9)', 
        backdropFilter: 'blur(10px)', 
        borderTop: '1px solid var(--glass-border)', 
        display: 'flex', 
        justifyContent: 'flex-end', 
        zIndex: 100,
        transition: 'left 0.3s ease'
      }}>
        <button className="glass-button" onClick={handleSave} disabled={saving} style={{ background: 'var(--accent-color)', width: '250px', justifyContent: 'center' }}>
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
