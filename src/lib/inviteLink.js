const LIVE_URL = 'https://trakya-digital-core.base44.app';

// Platformun davet e-postası yalnızca ana adrese gider; davetliye iletilen
// bağlantılar bu adrese kurularak doğru sayfayı açar.
export const inviteLink = (email, role = 'user') =>
  `${LIVE_URL}/register?email=${encodeURIComponent(email)}&returnTo=${role === 'admin' ? '/admin' : '/portal'}`;

// Yöneticinin oluşturduğu tek kullanımlık magic link — şifresiz, otomatik giriş.
export const magicLinkUrl = (token, returnTo = '/portal') =>
  `${LIVE_URL}/register?mtoken=${token}&returnTo=${encodeURIComponent(returnTo)}`;