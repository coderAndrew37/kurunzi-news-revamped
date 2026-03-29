// declare css side effects
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "next-cache" {
  export function revalidateTag(tag: string): void;
  export function revalidatePath(path: string): void;
}
