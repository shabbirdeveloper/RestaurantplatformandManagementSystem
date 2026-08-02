export const SOCIAL_ACCOUNT_SCHEMA_VERSION = 3;

export const socialPlatformOrder = ['facebook', 'instagram', 'tiktok', 'threads', 'google'];

export const socialPlatformPresets = {
  facebook: {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    description: 'Follow our page for restaurant news, promotions, and daily updates.',
    ctaLabel: 'Like page',
  },
  instagram: {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    description: 'Explore fresh dishes, restaurant moments, and food photography.',
    ctaLabel: 'Follow us',
  },
  tiktok: {
    label: 'TikTok',
    href: 'https://www.tiktok.com/',
    description: 'Watch our latest food videos, kitchen moments, and behind-the-scenes stories.',
    ctaLabel: 'Watch now',
  },
  threads: {
    label: 'Threads',
    href: 'https://www.threads.net/',
    description: 'Join our conversations, quick updates, and fresh stories from the restaurant.',
    ctaLabel: 'Follow us',
  },
  google: {
    label: 'Google Reviews',
    href: 'https://www.google.com/maps/search/?api=1&query=Naseeb+Capati+Nan+Malaysia',
    description: 'Read guest feedback and leave your own review for Naseeb Chapati.',
    ctaLabel: 'Write a review',
  },
};

export function inferSocialPlatform(account = {}) {
  const explicit = String(account.platform || account.className || '').toLowerCase().trim();
  if (socialPlatformPresets[explicit]) return explicit;

  const href = String(account.href || '').toLowerCase();
  const identity = `${account.title || ''} ${account.label || ''}`.toLowerCase();
  if (href.includes('facebook.com') || identity.includes('facebook')) return 'facebook';
  if (href.includes('instagram.com') || identity.includes('instagram')) return 'instagram';
  if (href.includes('tiktok.com') || identity.includes('tiktok')) return 'tiktok';
  if (href.includes('threads.net') || identity.includes('threads')) return 'threads';
  if (href.includes('google.') || href.includes('goo.gl/maps') || identity.includes('google')) return 'google';
  return '';
}

function inferLegacySocialPlatform(account = {}) {
  const href = String(account.href || '').toLowerCase();
  const identity = `${account.title || ''} ${account.label || ''}`.toLowerCase();
  if (href.includes('facebook.com')) return 'facebook';
  if (href.includes('instagram.com')) return 'instagram';
  if (href.includes('tiktok.com')) return 'tiktok';
  if (href.includes('threads.net')) return 'threads';
  if (href.includes('google.') || href.includes('goo.gl/maps')) return 'google';
  if (identity.includes('facebook')) return 'facebook';
  if (identity.includes('instagram')) return 'instagram';
  if (identity.includes('tiktok')) return 'tiktok';
  if (identity.includes('threads')) return 'threads';
  if (identity.includes('google')) return 'google';
  return inferSocialPlatform(account);
}

export function createSocialAccount(platform, overrides = {}) {
  const safePlatform = socialPlatformPresets[platform] ? platform : 'instagram';
  const preset = socialPlatformPresets[safePlatform];
  const displayOrder = socialPlatformOrder.indexOf(safePlatform) + 1;
  return {
    id: `social-${safePlatform}`,
    platform: safePlatform,
    className: safePlatform,
    label: preset.label,
    title: preset.label,
    href: preset.href,
    username: 'Naseeb Chapati',
    description: preset.description,
    ctaLabel: preset.ctaLabel,
    displayOrder,
    status: 'Active',
    branches: ['All branches'],
    ...overrides,
  };
}

export const defaultSocialAccounts = socialPlatformOrder.map((platform) => createSocialAccount(platform));

function normalizeSocialAccount(account, index) {
  const platform = inferSocialPlatform(account) || socialPlatformOrder[index % socialPlatformOrder.length];
  const preset = socialPlatformPresets[platform];
  return createSocialAccount(platform, {
    ...account,
    id: account.id || `social-${platform}-${index + 1}`,
    platform,
    className: platform,
    label: preset.label,
    title: preset.label,
    href: typeof account.href === 'string' && account.href.trim() ? account.href.trim() : preset.href,
    username: typeof account.username === 'string' ? account.username.trim() : 'Naseeb Chapati',
    description: typeof account.description === 'string' && account.description.trim() ? account.description.trim() : preset.description,
    ctaLabel: typeof account.ctaLabel === 'string' && account.ctaLabel.trim() ? account.ctaLabel.trim() : preset.ctaLabel,
    displayOrder: Number.isFinite(Number(account.displayOrder)) && Number(account.displayOrder) > 0 ? Number(account.displayOrder) : index + 1,
    status: account.status || 'Active',
    branches: Array.isArray(account.branches) && account.branches.length ? account.branches : ['All branches'],
  });
}

export function normalizeSocialAccounts(accounts, { migrateLegacy = false } = {}) {
  const source = Array.isArray(accounts)
    ? accounts.filter((account) => account && typeof account === 'object' && !Array.isArray(account))
    : [];

  const detectedPlatforms = source.map(inferSocialPlatform).filter(Boolean);
  const hasRepeatedPlatform = new Set(detectedPlatforms).size < detectedPlatforms.length;
  const hasMismatchedLegacyIdentity = source.some((account) => {
    const selectedPlatform = inferSocialPlatform(account);
    const linkedPlatform = inferLegacySocialPlatform({ ...account, platform: '', className: '' });
    return selectedPlatform && linkedPlatform && selectedPlatform !== linkedPlatform;
  });
  const shouldRepairLegacyData = migrateLegacy || hasRepeatedPlatform || hasMismatchedLegacyIdentity;

  if (!shouldRepairLegacyData) {
    return source
      .map(normalizeSocialAccount)
      .sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));
  }

  const uniqueAccounts = new Map();
  source
    .slice()
    .sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999))
    .forEach((account, index) => {
      const platform = inferLegacySocialPlatform(account);
      if (platform && !uniqueAccounts.has(platform)) {
        uniqueAccounts.set(platform, normalizeSocialAccount({ ...account, platform, className: platform }, index));
      }
    });

  return socialPlatformOrder.map((platform, index) => {
    const existing = uniqueAccounts.get(platform);
    return createSocialAccount(platform, existing ? { ...existing, displayOrder: index + 1 } : { displayOrder: index + 1 });
  });
}
