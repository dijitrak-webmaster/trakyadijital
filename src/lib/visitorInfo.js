// DijiBot web sohbeti için ziyaretçi kimliği: IP/cihaz bilgisi.
const IP_KEY = 'dijibot-visitor-ip';

const deviceInfo = () => {
  try {
    const w = window.innerWidth;
    const kind = w < 640 ? 'Mobil' : w < 1024 ? 'Tablet' : 'Masaüstü';
    const ua = (navigator.userAgent || '').slice(0, 100);
    return `${kind} · ${ua}`;
  } catch { return ''; }
};

export async function getVisitorInfo() {
  let ip = null;
  try {
    ip = localStorage.getItem(IP_KEY) || null;
    if (!ip) {
      const res = await fetch('https://api.ipify.org?format=json');
      const j = await res.json();
      ip = j?.ip || null;
      if (ip) { try { localStorage.setItem(IP_KEY, ip); } catch { /* sessizce */ } }
    }
  } catch { /* IP zorunlu değil — sessizce geç */ }
  return { ip_address: ip, device_info: deviceInfo() };
}