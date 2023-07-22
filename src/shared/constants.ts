export const albumRelations = [
  'authors',
  'series',
  'language',
  'group',
  'tags',
  'comments',
  'comments.author',
  'type',
  'rates',
  // 'images',
];

export const videoRelations = [
  'language',
  'tags',
  'episodes',
  'comments',
  'type',
  'episodes.qualities',
];

export const videoWithoutTagsRelations = [
  'language',
  'episodes',
  'comments',
  'type',
  'episodes.qualities',
];
