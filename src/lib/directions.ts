export type Direction = {
  id: number;
  name: string;
  tag: string;
  slogan: string;
};

export const directions: Direction[] = [
  { id: 27, name: "Swiss Metro", tag: "Campus Transit", slogan: "MANSUH AUKU. FREE THE CAMPUS." },
];

export const dirNames = directions.map((d) => d.name);

export function getLayoutDir(dir: number): number {
  return dir;
}
