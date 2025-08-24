const { getPool } = require('../db/supabase-pool');

async function getProjects(req, res) {
  try {
    const supabase = getPool();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, title, description, image_url, link')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json(projects || []);
  } catch (err) {
    console.error('Projects error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function createProject(req, res) {
  const { title, description, imageURL, link } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title is required' });
  
  try {
    const supabase = getPool();
    const { data: newProject, error } = await supabase
      .from('projects')
      .insert([
        {
          title: title,
          description: description || null,
          image_url: imageURL || null,
          link: link || null
        }
      ])
      .select();

    if (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(201).json(newProject?.[0] || { ok: true });
  } catch (err) {
    console.error('Create project error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateProject(req, res) {
  const { id } = req.params;
  const { title, description, imageURL, link } = req.body || {};
  if (!id) return res.status(400).json({ error: 'Missing id' });
  
  try {
    const supabase = getPool();
    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update({
        title: title || undefined,
        description: description || undefined,
        image_url: imageURL || undefined,
        link: link || undefined
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating project:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Update project error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deleteProject(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  
  try {
    const supabase = getPool();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Delete project error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getProjects, createProject, updateProject, deleteProject };


