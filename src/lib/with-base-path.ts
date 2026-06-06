const BASE_PATH = "";

export function withBasePath(path: string): string {
  if (!path) return path;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (!path.startsWith("/")) {
    return "";
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
