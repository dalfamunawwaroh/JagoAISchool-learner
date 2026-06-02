import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// 1. GET ALL AI TOOLS
router.get('/', async (req, res) => {
  try {
    const [tools] = await pool.query<any[]>(
      'SELECT * FROM ai_tools ORDER BY id ASC'
    );

    const toolsWithPros = await Promise.all(
      tools.map(async (tool) => {
        const [pros] = await pool.query<any[]>(
          'SELECT strength_text FROM ai_tool_pros WHERE tool_id = ?',
          [tool.id]
        );
        return {
          name: tool.name,
          type: tool.type,
          desc: tool.description,
          icon: tool.icon_url,
          color: tool.bg_color,
          pricing: tool.pricing_text,
          useCase: tool.use_case_description,
          pros: pros.map(p => p.strength_text)
        };
      })
    );

    res.json(toolsWithPros);
  } catch (error) {
    console.error('Fetch AI tools error:', error);
    res.status(500).json({ error: 'Server error fetching AI tools' });
  }
});

export default router;
