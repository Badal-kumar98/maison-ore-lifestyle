import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { session_id } = req.query;
      if (!session_id) return res.status(400).json({ error: 'session_id required' });

      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, variant, created_at, product:products(*)')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { session_id, product_id, quantity = 1, variant = null } = req.body;
      if (!session_id || !product_id) return res.status(400).json({ error: 'missing fields' });

      // If already exists (same session + product + variant), increment quantity
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('session_id', session_id)
        .eq('product_id', product_id)
        .eq('variant', variant ?? '')
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert({ session_id, product_id, quantity, variant: variant ?? '' })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, quantity } = req.body;
      if (!id) return res.status(400).json({ error: 'id required' });
      if (quantity <= 0) {
        const { error } = await supabase.from('cart_items').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ ok: true, removed: true });
      }
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id, session_id, clear } = req.body;
      if (clear && session_id) {
        const { error } = await supabase.from('cart_items').delete().eq('session_id', session_id);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }
      if (!id) return res.status(400).json({ error: 'id required' });
      const { error } = await supabase.from('cart_items').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('cart error:', err);
    res.status(500).json({ error: err.message });
  }
}
