const BASE_PATH = process.env.NODE_ENV === "production" ? "/iotrust-web" : "";

export function withBasePath(path: string): string {
  if (!path) return path;

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }

  if (!BASE_PATH) {
    return path;
  }

  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${BASE_PATH}${path}`;
  }

  return `${BASE_PATH}/${path}`;
}
