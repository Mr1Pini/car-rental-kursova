const PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
      <rect fill="#e2e8f0" width="400" height="240"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="18">Немає фото</text>
    </svg>`,
  );

export function getCarImageUrl(imageName: string): string {
  if (!imageName) return PLACEHOLDER;
  return `/images/cars/${imageName}`;
}

export function handleImageError(
  e: { currentTarget: HTMLImageElement },
): void {
  e.currentTarget.src = PLACEHOLDER;
}
