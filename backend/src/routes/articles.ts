import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// 1. GET ALL ARTICLES
router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    let sql = 'SELECT * FROM articles WHERE 1=1';
    const params: any[] = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY published_at DESC';

    const [articles] = await pool.query<any[]>(sql, params);
    
    // Map backend to match frontend Article detail interface
    const mappedArticles = articles.map(art => ({
      id: art.id,
      title: art.title,
      desc: art.description,
      content: art.content,
      author: art.author_name,
      date: new Date(art.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: art.read_time_text,
      img: art.image_url,
      category: art.category
    }));

    res.json(mappedArticles);
  } catch (error) {
    console.error('Fetch articles error:', error);
    res.status(500).json({ error: 'Server error fetching articles' });
  }
});

// 2. GET TRENDING TICKER NEWS
router.get('/trending', async (req, res) => {
  try {
    const [news] = await pool.query(
      'SELECT type, title FROM trending_news ORDER BY created_at DESC LIMIT 10'
    );
    res.json(news);
  } catch (error) {
    console.error('Fetch trending news error:', error);
    res.status(500).json({ error: 'Server error fetching trending news' });
  }
});

export default router;
