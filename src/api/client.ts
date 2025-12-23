import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../utils/constants';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    // Response interceptor - silently handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Silently reject - the calling code will fall back to mock data
        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  async getRaw<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  // Get HTML content as text (for scraping)
  // Note: This uses a full URL (not relative to API_BASE_URL) to access the website
  async getHtml(fullUrl: string): Promise<string> {
    // Use axios directly with the full URL (not the client instance which uses API_BASE_URL)
    // This ensures cookies are sent for authenticated requests
    const response = await axios.get(fullUrl, {
      responseType: 'text',
      timeout: 10000,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      // Include credentials/cookies for authenticated requests
      withCredentials: true,
    });
    return response.data;
  }

  async post<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }
}

export const apiClient = new ApiClient();
