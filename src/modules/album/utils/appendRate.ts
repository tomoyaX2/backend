import { AlbumDto } from '../album.dto';

const appendRate = (items: AlbumDto[]) => {
  return items?.map((el) => ({ ...el, rate: el.rate })) ?? [];
};

export { appendRate };
