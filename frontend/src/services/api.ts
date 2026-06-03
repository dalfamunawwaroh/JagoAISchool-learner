const TOKEN_KEY = 'jagoai_school_jwt_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const apiCall = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Set JSON content-type if body is provided and not FormData
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred during the API call';
    try {
      const errObj = await response.json();
      errorMessage = errObj.error || errorMessage;
    } catch (e) {
      // JSON parsing failed
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// --- AUTH SERVICES ---
export const authService = {
  login: async (credentials: { email: string; password?: string }) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  register: async (data: any) => {
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  getMe: async () => {
    return apiCall('/api/auth/me');
  },
  updateProfile: async (data: any) => {
    return apiCall('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  updateSettings: async (data: any) => {
    return apiCall('/api/auth/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  getSessions: async () => {
    return apiCall('/api/auth/settings/sessions');
  },
  revokeSession: async (id: number) => {
    return apiCall(`/api/auth/settings/sessions/${id}`, {
      method: 'DELETE'
    });
  },
  forgotPassword: async (email: string) => {
    return apiCall('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  resetPassword: async (data: any) => {
    return apiCall('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  getLeaderboard: async () => {
    return apiCall('/api/auth/leaderboard');
  },
  getActiveUsers: async () => {
    return apiCall('/api/auth/active-users');
  }
};

// --- COURSE SERVICES ---
export const courseService = {
  getCourses: async (level?: string, category?: string) => {
    let url = '/api/courses';
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (category) params.append('category', category);
    const query = params.toString();
    if (query) url += `?${query}`;
    
    return apiCall(url);
  },
  getEnrollments: async () => {
    return apiCall('/api/courses/enrollments');
  },
  getCourseDetail: async (id: number) => {
    return apiCall(`/api/courses/${id}`);
  },
  enrollCourse: async (id: number) => {
    return apiCall(`/api/courses/${id}/enroll`, {
      method: 'POST'
    });
  },
  updateLessonProgress: async (lessonId: number, isCompleted: boolean) => {
    return apiCall(`/api/courses/lessons/${lessonId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ isCompleted })
    });
  }
};

// --- DISCUSSION SERVICES ---
export const discussionService = {
  getCategories: async () => {
    return apiCall('/api/discussions/categories');
  },
  getThreads: async (category?: string, search?: string) => {
    let url = '/api/discussions/threads';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const query = params.toString();
    if (query) url += `?${query}`;
    return apiCall(url);
  },
  createThread: async (data: any) => {
    return apiCall('/api/discussions/threads', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  getChatMessages: async (threadId: number) => {
    return apiCall(`/api/discussions/threads/${threadId}/messages`);
  },
  sendMessage: async (threadId: number, data: any) => {
    return apiCall(`/api/discussions/threads/${threadId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  likeThread: async (threadId: number) => {
    return apiCall(`/api/discussions/threads/${threadId}/like`, {
      method: 'POST'
    });
  },
  reactMessage: async (messageId: number, emoji: string) => {
    return apiCall(`/api/discussions/messages/${messageId}/react`, {
      method: 'POST',
      body: JSON.stringify({ emoji })
    });
  }
};

// --- CONSULTATION SERVICES ---
export const consultationService = {
  getMentors: async () => {
    return apiCall('/api/consultations/mentors');
  },
  bookSession: async (data: any) => {
    return apiCall('/api/consultations/mentorship/sessions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  submitAudit: async (data: any) => {
    return apiCall('/api/consultations/portfolio/audits', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  scheduleMock: async (data: any) => {
    return apiCall('/api/consultations/mock-interviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  createTicket: async (data: any) => {
    return apiCall('/api/consultations/tickets', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

// --- EVENT SERVICES ---
export const eventService = {
  getEvents: async (category?: string, price?: string) => {
    let url = '/api/events';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (price) params.append('price', price);
    const query = params.toString();
    if (query) url += `?${query}`;
    return apiCall(url);
  },
  getRegisteredEvents: async () => {
    return apiCall('/api/events/registered');
  },
  registerEvent: async (id: number, data: any) => {
    return apiCall(`/api/events/${id}/register`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  getHistory: async () => {
    return apiCall('/api/events/history');
  }
};

// --- AI TOOL SERVICES ---
export const aiToolService = {
  getAiTools: async () => {
    return apiCall('/api/aitools');
  }
};

// --- ARTICLE SERVICES ---
export const articleService = {
  getArticles: async (category?: string) => {
    let url = '/api/articles';
    if (category) url += `?category=${encodeURIComponent(category)}`;
    return apiCall(url);
  },
  getTrendingNews: async () => {
    return apiCall('/api/articles/trending');
  }
};

// --- NOTIFICATION SERVICES ---
export const notificationService = {
  getNotifications: async (filter?: string) => {
    let url = '/api/notifications';
    if (filter) url += `?filter=${filter}`;
    return apiCall(url);
  },
  toggleReadNotification: async (id: number) => {
    return apiCall(`/api/notifications/${id}/read`, {
      method: 'PUT'
    });
  },
  deleteNotification: async (id: number) => {
    return apiCall(`/api/notifications/${id}`, {
      method: 'DELETE'
    });
  }
};
