export const getQueryWithFilteredExceptions = () =>
  `SELECT DISTINCT "distinctAlias"."album_id" as "album_id", "distinctAlias"."album_created_date", "distinctAlias"."album_title" FROM` +
  `(SELECT "album"."id" AS "album_id", "album"."title" AS "album_title", "album"."created_date" AS "album_created_date" FROM "album" "album" ` +
  `LEFT JOIN album_tags ON album_tags.album_id = album.id ` +
  `LEFT JOIN tag tags ON tags.id = album_tags.tag_id WHERE tags.id IN (SELECT tag_id FROM album_tags WHERE album_tags.tag_id = $1)) ` +
  `"distinctAlias" ORDER BY "distinctAlias"."album_created_date"  DESC, "album_id" ASC`;

export const getDataWithRelations = (dataToSelect, orderBy) => {
  const queryIdSymbols = dataToSelect
    .map((_, index) => `$${index + 1}`)
    .join(', ');
  return (
    `SELECT "Album"."id" AS "Album_id", "Album"."title" AS "Album_title", "Album"."views" AS "Album_views",  "Album"."totalImages" AS "Album_totalImages", "Album"."path" AS "Album_path", "Album"."downloadPath" AS "Album_downloadPath", "Album"."preview" AS "Album_preview", "Album"."previewOrientation" AS "Album_previewOrientation", "Album"."created_date" AS "Album_created_date", "Album"."updated_date" AS "Album_updated_date",` +
    `"Album"."gallery_id" AS "Album_gallery_id",` +
    `"Album"."type_id" AS "Album_type_id",` +
    `"Album"."series_id" AS "Album_series_id", ` +
    `"Album"."language_id" AS "Album_language_id", ` +
    `"Album"."group_id" AS "Album_group_id",` +
    `"Album__type"."id" AS "Album__type_id", "Album__type"."name" AS "Album__type_name",` +
    `"Album__language"."id" AS "Album__language_id", "Album__language"."name" AS "Album__language_name",` +
    `"Album__group"."id" AS "Album__group_id","Album__group"."name" AS "Album__group_name",` +
    `"Album__tags"."id" AS "Album__tags_id", "Album__tags"."name" AS "Album__tags_name", "Album__tags"."albumsCount" AS "Album__tags_albumsCount"` +
    `FROM "album" "Album" ` +
    `LEFT JOIN "album_authors" "Album_Album__authors" ON "Album_Album__authors"."album_id"="Album"."id" ` +
    `LEFT JOIN "author" "Album__authors" ON "Album__authors"."id"="Album_Album__authors"."author_id"` +
    `LEFT JOIN "series" "Album__series" ON "Album__series"."id"="Album"."series_id" ` +
    `LEFT JOIN "type" "Album__type" ON "Album__type"."id"="Album"."type_id"  ` +
    `LEFT JOIN "language" "Album__language" ON "Album__language"."id"="Album"."language_id"  ` +
    `LEFT JOIN "group" "Album__group" ON "Album__group"."id"="Album"."group_id"  ` +
    `LEFT JOIN "album_tags" "Album_Album__tags" ON "Album_Album__tags"."album_id"="Album"."id" ` +
    `LEFT JOIN "tag" "Album__tags" ON "Album__tags"."id"="Album_Album__tags"."tag_id" WHERE "Album"."id" IN (${queryIdSymbols}) ORDER BY "Album"."${orderBy}" DESC`
  );
};
