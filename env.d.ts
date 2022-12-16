/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const vueComponent: DefineComponent<{}, {}, any>;
  export default vueComponent;
} 

// declare module 'pinia' {
//   export interface DefineStoreOptionsBase<S, Store> {
//     presist?: Partial<PresistType<S, Store>>
//   }
// }