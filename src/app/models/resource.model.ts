export interface Resource {
    id: number;
    title: string;
    description: string;
    type: 'PDF' | 'Video' | 'Article' | 'Link';
    url: string;
    category: string;
    createdAt: string;
    thumbnailUrl?: string;
    author?: string;
    tags?: string[];
    downloadCount?: number;
    isPublic: boolean;
  } 