export interface NonUnifiedVideo {
  Video_id: string;
  Video_title: string;
  Video_views: number;
  Video_rate: number;
  Video_created_date: string;
  Video_updated_date: string;
  Video_coverImageUrl: string;

  Video_type_id: string;
  Video__episodes_id: string;
  Video__episodes_name: string;
  Video__episodes_url: string;
  Video__episodes_coverUrl: string;
  Video_language_id: string;
  Video_group_id: string;
  Video__type_id: string;
  Video__type_name: string;
  Video__language_id: string;
  Video__language_name: string;
  Video__tags_id: string;
  Video__tags_name: string;
  Video__studio_id: string;
  Video__studio_name: string;
  Video__tags_VideosCount: number;
  Video__rates_id: string;
  Video__rates_rate: number;
}
