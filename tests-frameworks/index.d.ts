declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.vue" {
  const component: any;
  export default component;
}

declare module "*.marko" {
  const template: any;
  export default template;
}

declare module "https://esm.sh/@arrow-js/core" {
  export const reactive: any;
  export const html: any;
}
