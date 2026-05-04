export default function sitemap() {
  const baseUrl = 'https://streamdle.net';
  const today = new Date().toISOString();

  return [
    { url: baseUrl, lastModified: today, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/classic`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/avatardle`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/categorydle`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/higherdle`, lastModified: today, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/como-jugar`, lastModified: today, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contacto`, lastModified: today, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacidad`, lastModified: today, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terminos`, lastModified: today, changeFrequency: 'monthly', priority: 0.3 },
  ];
}