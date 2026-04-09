const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'خطای سرور' }));
    throw new Error(err.error || 'خطای سرور');
  }
  return res.json();
}

export const api = {
  // Auth
  sendOtp: (phone: string) => request('/auth/otp/send', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone: string, code: string) => request<{ token: string; user: any }>('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ phone, code }) }),
  adminLogin: (username: string, password: string) => request<{ token: string; user: any }>('/auth/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  getMe: () => request<any>('/auth/me'),

  // Campaigns
  getCampaigns: () => request<any[]>('/campaigns'),
  getCampaign: (slug: string) => request<any>(`/campaigns/${slug}`),
  createCampaign: (data: any) => request('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  updateCampaign: (id: number, data: any) => request(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCampaign: (id: number) => request(`/campaigns/${id}`, { method: 'DELETE' }),
  addMedia: (id: number, data: any) => request(`/campaigns/${id}/media`, { method: 'POST', body: JSON.stringify(data) }),
  deleteMedia: (id: number, mediaId: number) => request(`/campaigns/${id}/media/${mediaId}`, { method: 'DELETE' }),

  // Payments
  initPayment: (data: any) => request<{ payment_url: string; authority: string }>('/payments/init', { method: 'POST', body: JSON.stringify(data) }),

  // Donations
  getMyDonations: () => request<any[]>('/donations/mine'),

  // Messages
  getFeaturedMessages: () => request<{ today: any; top: any[] }>('/messages/featured'),
  getCampaignMessages: (campaignId: number, mode?: string) => request<any[]>(`/messages/campaign/${campaignId}${mode ? `?mode=${mode}` : ''}`),
  submitMessage: (data: any) => request('/messages', { method: 'POST', body: JSON.stringify(data) }),
  voteMessage: (id: number) => request(`/messages/${id}/vote`, { method: 'POST' }),
  getMyVotes: () => request<number[]>('/messages/my-votes'),
  getPendingMessages: () => request<any[]>('/messages/admin/pending'),
  moderateMessage: (id: number, status: string) => request(`/messages/${id}/moderate`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Testimonials
  getTestimonials: () => request<any[]>('/testimonials'),
  createTestimonial: (data: any) => request('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  updateTestimonial: (id: number, data: any) => request(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTestimonial: (id: number) => request(`/testimonials/${id}`, { method: 'DELETE' }),

  // Volunteers
  submitVolunteer: (data: any) => request('/volunteers', { method: 'POST', body: JSON.stringify(data) }),
  getVolunteers: () => request<any[]>('/volunteers'),

  // Impact
  getImpactReports: () => request<any[]>('/impact-reports'),
  createImpactReport: (data: any) => request('/impact-reports', { method: 'POST', body: JSON.stringify(data) }),
};
