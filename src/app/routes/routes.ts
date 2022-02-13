import { Collections } from "../modules/collections";
import { DetailCollection } from "../modules/detail-collection";

export const routes = [
  {
    path: '/',
    component: Collections, // сюда подставить компоненту модуля Translator
    name: 'root',
    isProtected: false
  },
  {
    path: '/collections',
    component: Collections,
    name: 'collections',
    isProtected: true
  },
  {
    path: '/collection-detail/:id',
    component: DetailCollection,
    name: 'collection-detail',
    isProtected: true
  }
];