const BACKUP_BASE_PATH = "/backup";
const BACKUP_SNAPSHOT_PATH = "/backups/main-2026-05-12";
const BACKUP_DOCUMENTS = new Map([
  ["/", "/index.html"],
  ["/index.html", "/index.html"],
  ["/privacy-policy", "/privacy-policy.html"],
  ["/terms-and-conditions", "/terms-and-conditions.html"],
]);

function getBackupAssetPath(pathname) {
  const suffix = pathname.slice(BACKUP_BASE_PATH.length) || "/";
  const normalizedPath = suffix.startsWith("/") ? suffix : `/${suffix}`;

  if (BACKUP_DOCUMENTS.has(normalizedPath)) {
    return `${BACKUP_SNAPSHOT_PATH}${BACKUP_DOCUMENTS.get(normalizedPath)}`;
  }

  return `${BACKUP_SNAPSHOT_PATH}${normalizedPath}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === BACKUP_BASE_PATH) {
      url.pathname = `${BACKUP_BASE_PATH}/`;
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname.startsWith(`${BACKUP_BASE_PATH}/`)) {
      url.pathname = getBackupAssetPath(url.pathname);
      return env.ASSETS.fetch(new Request(url.toString(), request));
    }

    return env.ASSETS.fetch(request);
  },
};
