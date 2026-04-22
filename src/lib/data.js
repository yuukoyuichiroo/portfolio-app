import fs from 'fs/promises';
import path from 'path';

export async function getLocalJsonData() {
  const contentDir = path.join(process.cwd(), 'src/content');
  const home = JSON.parse(await fs.readFile(path.join(contentDir, 'home.json'), 'utf-8'));
  const about = JSON.parse(await fs.readFile(path.join(contentDir, 'about.json'), 'utf-8'));
  const experience = JSON.parse(await fs.readFile(path.join(contentDir, 'experience.json'), 'utf-8'));
  const contact = JSON.parse(await fs.readFile(path.join(contentDir, 'contact.json'), 'utf-8'));
  
  const projectsDir = path.join(contentDir, 'projects');
  const projectFiles = await fs.readdir(projectsDir);
  const projects = await Promise.all(
    projectFiles.map(async (file) => {
      const data = await fs.readFile(path.join(projectsDir, file), 'utf-8');
      return JSON.parse(data);
    })
  );

  return { home, about, experience, projects, contact };
}

export async function getPortfolioData() {
  if (!process.env.MOCK_API_URL) {
    console.log('No MOCK_API_URL provided. Falling back to local JSON data.');
    return getLocalJsonData();
  }

  try {
    const res = await fetch(process.env.MOCK_API_URL, { cache: 'no-store' });
    
    // If empty or doesn't exist, seed it
    if (!res.ok || res.status === 404) {
      console.log('MockAPI endpoint is empty or missing. Seeding from local JSON files...');
      const localData = await getLocalJsonData();
      
      // POST to create the first record
      const seedUrl = process.env.MOCK_API_URL.replace('/1', ''); // Remove ID if present for POST
      await fetch(seedUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: "1", ...localData })
      });
      return localData;
    }

    const data = await res.json();
    return {
      home: data.home,
      about: data.about,
      experience: data.experience,
      projects: data.projects,
      contact: data.contact
    };
  } catch (err) {
    console.error('Failed to fetch from MockAPI, falling back to JSON:', err);
    return getLocalJsonData();
  }
}

export async function updatePortfolioData(newData) {
  if (!process.env.MOCK_API_URL) {
    throw new Error("MOCK_API_URL is required to save data via the Admin Panel.");
  }
  
  const res = await fetch(process.env.MOCK_API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData)
  });

  if (!res.ok) {
    throw new Error('Failed to save to MockAPI');
  }

  return { success: true };
}
