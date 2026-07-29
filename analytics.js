
(() => {
  const id = window.SITE_GA_ID || 'G-XXXXXXXXXX';
  if (!id || id === 'G-XXXXXXXXXX') return;
  const key = 'hardinge_analytics_consent';

  function loadGA(){
    if (window.gtag) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }

  const choice = localStorage.getItem(key);
  if (choice === 'accepted') { loadGA(); return; }
  if (choice === 'declined') return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-label','Analytics cookie choice');
  banner.innerHTML = `
    <p><strong>Optional analytics</strong><br>Allow anonymous analytics so the seller can understand which property sections and viewing links are most useful. The website works without analytics. <a href="privacy.html">Learn more</a>.</p>
    <div class="cookie-actions">
      <button class="btn btn-primary btn-small" type="button" data-accept>Allow</button>
      <button class="btn btn-secondary btn-small" type="button" data-decline>Decline</button>
    </div>`;
  document.body.appendChild(banner);
  banner.querySelector('[data-accept]').addEventListener('click', () => {
    localStorage.setItem(key,'accepted'); banner.remove(); loadGA();
  });
  banner.querySelector('[data-decline]').addEventListener('click', () => {
    localStorage.setItem(key,'declined'); banner.remove();
  });
})();
