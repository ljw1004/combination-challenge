/** Authored coordinates are pixels of the chapter's complete background image. */
export interface ImageSize {width: number; height: number}
export interface Point {x: number; y: number}

export function validCentre(point: Point, image?: ImageSize): boolean {
  return [point.x, point.y].every(value => Number.isFinite(value) && value >= 0)
    && (!image || point.x <= image.width && point.y <= image.height);
}
