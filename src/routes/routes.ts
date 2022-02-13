import {Translate} from "../components/organism/Translate";
import {Collections} from "../components/organism/Collections";
import {DetailCollection} from "../components/organism/DetailCollection";

export const routes = [
  {
    path: '/',
    component: Translate,
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