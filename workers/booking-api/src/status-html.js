export const statusPage = ({ title, message }) => {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${escapeHtml(title)}</title>
<style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1rem;line-height:1.5;color:#1a1a1a}h1{font-size:1.35rem}</style></head>
<body><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>
<p><a href="https://calvindaniel.com/book/review/">Review queue</a> · <a href="https://calvindaniel.com/book/">Booking page</a></p></body></html>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
};

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
