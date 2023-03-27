import { Links, LinksType } from '@models/common/link';

const urls: LinksType = {
  [Links.ADMIN]: () => '/admin',
  [Links.TODO]: () => '/todo',
};

export default urls;