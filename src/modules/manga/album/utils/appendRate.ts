import { VideoDto } from 'src/modules/video/video/video.dto';
import { AlbumDto } from '../album.dto';

const appendRate = (items: AlbumDto[] | VideoDto[]) => {
  return items?.map((el) => ({ ...el, rate: el.rate })) ?? [];
};

export { appendRate };
