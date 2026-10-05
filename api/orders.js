import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const {
        session_id,
        customer_email,
        customer_name,
        shipping_address,
        items,
        subtotal,
        shipping,
        total,
      } = req.body;

      if (!customer_email || !items || !items.length) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const order_number = 'MO-' + Math.random().toString(36).slice(2, 8).toUpperCase();

      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_number,
          session_id,
          customer_email,
          customer_name,
          shipping_address,
          items,
          subtotal,
          shipping,
          total,
          status: 'confirmed',
        })
        .select()
        .single();
      if (error) throw error;

      // Clear cart
      if (session_id) {
        await supabase.from('cart_items').delete().eq('session_id', session_id);
      }

      return res.status(201).json(data);
    }

    if (req.method === 'GET') {
      const { order_number } = req.query;
      if (order_number) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('order_number', order_number)
          .maybeSingle();
        if (error) throw error;
        return res.status(200).json(data);
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('orders error:', err);
    res.status(500).json({ error: err.message });
  }
}
