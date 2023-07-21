export const getDataWithRelations = (dataToSelect, orderBy) => {
  const queryIdSymbols = dataToSelect
    .map((_, index) => `$${index + 1}`)
    .join(', ');
  return (
    `SELECT "Video"."id" AS "Video_id",
    "Video"."title" AS "Video_title", 
    "Video"."originalTitle" AS "Video_originalTitle",
    "Video"."views" AS "Video_views", 
    "Video"."description" AS "Video_description",
    "Video"."releaseDate" AS "Video_releaseDate",
    "Video"."coverImageUrl" AS "Video_coverImageUrl",
    "Video"."created_date" AS "Video_created_date", 
    "Video"."updated_date" AS "Video_updated_date",` +
    //
    //
    //
    `"Video"."type_id" AS "Video_type_id",
    "Video"."language_id" AS "Video_language_id",
    "Video__language"."id" AS "Video__language_id",
    "Video__language"."name" AS "Video__language_name",
    "Video__tags"."id" AS "Video__tags_id", "Video__tags"."name" AS "Video__tags_name",
    "Video__tags"."videosCount" AS "Video__tags_videosCount",
    "Video__episodes"."id" AS "Video__episodes_id",
    "Video__episodes"."name" AS "Video__episodes_name",
    "Video__episodes"."url" AS "Video__episodes_url",
    "Video__episodes"."coverUrl" AS "Video__episodes_coverUrl",
    "Video__episodes"."videoId" AS "Video__episodes_videoId",` +
    // "Video__episodes__qualities"."id" AS "Video__episodes__qualities_id",
    // "Video__episodes__qualities"."name" AS "Video__episodes__qualities_name",
    // "Video__comments"."id" AS "Video__comments_id",
    // "Video__comments"."text" AS "Video__comments_text",
    // "Video__comments"."created_date" AS "Video__comments_created_date",
    // "Video__comments"."updated_date" AS "Video__comments_updated_date",
    // "Video__comments"."videoId" AS "Video__comments_videoId",
    // "Video__comments"."authorId" AS "Video__comments_authorId",
    `"Video__type"."id" AS "Video__type_id",
    "Video__type"."name" AS "Video__type_name"` +
    //
    //
    //
    `FROM "video" "Video"` +
    //
    //
    //
    `LEFT JOIN "video-language" "Video__language" ON "Video__language"."id"="Video"."language_id"
    LEFT JOIN "video_tags" "Video_Video__tags" ON "Video_Video__tags"."video_id"="Video"."id"
    LEFT JOIN "video-tag" "Video__tags" ON "Video__tags"."id"="Video_Video__tags"."tag_id"
    LEFT JOIN "episode" "Video__episodes" ON "Video__episodes"."videoId"="Video"."id"` +
    // LEFT JOIN "episode_quality" "Video__episodes_Video__episodes__qualities" ON "Video__episodes_Video__episodes__qualities"."episode_id"="Video__episodes"."id"
    // LEFT JOIN "quality" "Video__episodes__qualities" ON "Video__episodes__qualities"."id"="Video__episodes_Video__episodes__qualities"."quality_id"
    // LEFT JOIN "video-comment" "Video__comments" ON "Video__comments"."videoId"="Video"."id"
    `LEFT JOIN "video-type" "Video__type" ON "Video__type"."id"="Video"."type_id"` +
    `WHERE "Video"."id" IN (${queryIdSymbols}) ORDER BY "Video"."${orderBy}" DESC`
  );
};
