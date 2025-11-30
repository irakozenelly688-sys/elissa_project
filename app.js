// Simple SPA logic to fetch tools and send rent requests
async function fetchTools() {
  const res = await fetch('/api/tools');
  if (!res.ok) throw new Error('Failed to fetch tools');
  return res.json();
}

function renderTools(tools) {
  const list = document.getElementById('tools-list');
  const select = document.getElementById('toolSelect');
  list.innerHTML = '';
  select.innerHTML = '';

  tools.forEach(t => {
    // card
    const card = document.createElement('div');
    card.className = 'tool-card';
    const img = document.createElement('img');
    img.src = t.image_path || '/images/placeholder.jpg';
    img.alt = t.name;
    const title = document.createElement('h4');
    title.textContent = t.name;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${t.category} • qty: ${t.quantity} • $${parseFloat(t.price_per_day).toFixed(2)}/day`;
    const actions = document.createElement('div');
    actions.className = 'actions';
    const rentBtn = document.createElement('button');
    rentBtn.textContent = 'Rent';
    rentBtn.disabled = t.quantity <= 0;
    rentBtn.onclick = () => {
      document.getElementById('toolSelect').value = t.id;
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
    actions.appendChild(rentBtn);
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(actions);
    list.appendChild(card);

    // select option
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.name} (qty: ${t.quantity})`;
    select.appendChild(opt);
  });
}

async function init() {
  try {
    const tools = await fetchTools();
    renderTools(tools);
  } catch (err) {
    document.getElementById('tools-list').textContent = 'Failed to load tools';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init();

  const form = document.getElementById('rentForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      tool_id: document.getElementById('toolSelect').value,
      renter_name: document.getElementById('renterName').value,
      renter_contact: document.getElementById('renterContact').value,
      start_date: document.getElementById('startDate').value,
      end_date: document.getElementById('endDate').value || null
    };
    const msg = document.getElementById('rentMessage');
    msg.textContent = 'Processing...';
    try {
      const res = await fetch('/api/rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed');
      msg.textContent = 'Rented successfully (id: ' + body.rental_id + ')';
      form.reset();
      await init(); // refresh tool list
    } catch (err) {
      msg.textContent = 'Error: ' + err.message;
      msg.style.color = 'crimson';
      setTimeout(()=>{ msg.style.color = 'green'; }, 3000);
      console.error(err);
    }
  });
});