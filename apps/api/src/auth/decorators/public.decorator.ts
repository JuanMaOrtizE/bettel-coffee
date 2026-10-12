import { SetAuthRealm } from './auth-realm.decorator.js';

export const Public = () => SetAuthRealm('public');
