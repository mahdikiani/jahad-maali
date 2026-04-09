export interface Campaign {
  id: number;
  title: string;
  slug: string;
  description: string;
  target_amount: number;
  current_amount: number;
  cover_image: string | null;
  cover_video: string | null;
  category: 'shelter' | 'food' | 'medical' | 'education' | 'defense' | 'other';
  status: 'active' | 'completed' | 'paused';
  deadline: string | null;
  created_at: string;
  media?: CampaignMedia[];
  reports?: ImpactReport[];
}

export interface CampaignMedia {
  id: number;
  campaign_id: number;
  url: string;
  type: 'image' | 'video';
  caption: string | null;
  sort_order: number;
}

export interface Donation {
  id: number;
  campaign_id: number;
  campaign_title: string;
  user_id: number | null;
  amount: number;
  donor_name: string;
  phone: string;
  status: 'pending' | 'paid' | 'failed';
  payment_ref: string | null;
  created_at: string;
  message_text?: string;
  vote_count?: number;
}

export interface Message {
  id: number;
  donation_id: number;
  campaign_id: number;
  user_id: number;
  user_name: string | null;
  user_phone: string;
  text: string;
  vote_count: number;
  score: number;
  donation_amount: number;
  status: 'pending' | 'approved' | 'hidden';
  created_at: string;
  campaign_title?: string;
}

export interface ImpactReport {
  id: number;
  campaign_id: number;
  title: string;
  body: string;
  image_url: string | null;
  video_url: string | null;
  amount_spent: number;
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string | null;
  text: string;
  avatar: string | null;
  sort_order: number;
}

export interface User {
  id: number;
  phone: string;
  name: string | null;
  role: 'user' | 'admin' | 'superadmin';
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}
