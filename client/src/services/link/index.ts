import { LinksType } from '@models/common/link';
import LinksUrls from '@services/link/urls';

class Link {
  get getUrl(): LinksType {
    return {
      ...LinksUrls,
    };
  }
}

const link = new Link();

export default <Link>link;