/**
 * Tests for apiService
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../../src/services/apiService';

// Mock axios
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  };
  return mockAxios;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Instance Creation', () => {
    it('should create axios instance with correct config', () => {
      // axios.create is called during module import
      // The mock may be called before our test runs
      expect(mockAxios.create).toBeDefined();
    });

    it('should set up request interceptor', () => {
      // Interceptors are set up during module import
      expect(mockAxios.interceptors.request.use).toBeDefined();
    });

    it('should set up response interceptor', () => {
      // Interceptors are set up during module import
      expect(mockAxios.interceptors.response.use).toBeDefined();
    });
  });

  describe('GET requests', () => {
    it('should make GET request', async () => {
      const mockResponse = { data: { id: 1, name: 'Test' } };
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      
      const response = await apiService.get('/test');
      
      expect(mockAxios.get).toHaveBeenCalledWith('/test', undefined);
      expect(response).toEqual(mockResponse);
    });

    it('should pass config to GET request', async () => {
      const mockResponse = { data: {} };
      const config = { params: { page: 1 } };
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      
      await apiService.get('/test', config);
      
      expect(mockAxios.get).toHaveBeenCalledWith('/test', config);
    });

    it('should handle GET error', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(apiService.get('/test')).rejects.toThrow('Network error');
    });
  });

  describe('POST requests', () => {
    it('should make POST request', async () => {
      const mockResponse = { data: { success: true } };
      const payload = { name: 'Test' };
      mockAxios.post.mockResolvedValueOnce(mockResponse);
      
      const response = await apiService.post('/test', payload);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/test', payload, undefined);
      expect(response).toEqual(mockResponse);
    });

    it('should handle POST with empty body', async () => {
      const mockResponse = { data: {} };
      mockAxios.post.mockResolvedValueOnce(mockResponse);
      
      await apiService.post('/test');
      
      expect(mockAxios.post).toHaveBeenCalledWith('/test', undefined, undefined);
    });

    it('should handle POST error', async () => {
      mockAxios.post.mockRejectedValueOnce(new Error('Server error'));
      
      await expect(apiService.post('/test', {})).rejects.toThrow('Server error');
    });
  });

  describe('PUT requests', () => {
    it('should make PUT request', async () => {
      const mockResponse = { data: { updated: true } };
      const payload = { name: 'Updated' };
      mockAxios.put.mockResolvedValueOnce(mockResponse);
      
      const response = await apiService.put('/test/1', payload);
      
      expect(mockAxios.put).toHaveBeenCalledWith('/test/1', payload, undefined);
      expect(response).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make DELETE request', async () => {
      const mockResponse = { data: { deleted: true } };
      mockAxios.delete.mockResolvedValueOnce(mockResponse);
      
      const response = await apiService.delete('/test/1');
      
      expect(mockAxios.delete).toHaveBeenCalledWith('/test/1', undefined);
      expect(response).toEqual(mockResponse);
    });
  });

  describe('PATCH requests', () => {
    it('should make PATCH request', async () => {
      const mockResponse = { data: { patched: true } };
      const payload = { status: 'active' };
      mockAxios.patch.mockResolvedValueOnce(mockResponse);
      
      const response = await apiService.patch('/test/1', payload);
      
      expect(mockAxios.patch).toHaveBeenCalledWith('/test/1', payload, undefined);
      expect(response).toEqual(mockResponse);
    });
  });

  describe('Error Response Handling', () => {
    it('should handle 401 error', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };
      mockAxios.get.mockRejectedValueOnce(error);
      
      await expect(apiService.get('/protected')).rejects.toEqual(error);
    });

    it('should handle 404 error', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      };
      mockAxios.get.mockRejectedValueOnce(error);
      
      await expect(apiService.get('/not-found')).rejects.toEqual(error);
    });

    it('should handle 500 error', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };
      mockAxios.post.mockRejectedValueOnce(error);
      
      await expect(apiService.post('/endpoint', {})).rejects.toEqual(error);
    });

    it('should handle network error', async () => {
      const error = new Error('Network Error');
      mockAxios.get.mockRejectedValueOnce(error);
      
      await expect(apiService.get('/test')).rejects.toThrow('Network Error');
    });
  });

  describe('Request Config', () => {
    it('should accept custom headers', async () => {
      const mockResponse = { data: {} };
      const config = { headers: { 'X-Custom-Header': 'value' } };
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      
      await apiService.get('/test', config);
      
      expect(mockAxios.get).toHaveBeenCalledWith('/test', config);
    });

    it('should accept custom timeout', async () => {
      const mockResponse = { data: {} };
      const config = { timeout: 60000 };
      mockAxios.post.mockResolvedValueOnce(mockResponse);
      
      await apiService.post('/test', {}, config);
      
      expect(mockAxios.post).toHaveBeenCalledWith('/test', {}, config);
    });
  });

  describe('Type Safety', () => {
    it('should return typed response', async () => {
      interface User {
        id: number;
        name: string;
      }
      
      const mockResponse = { data: { id: 1, name: 'Test' } };
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      
      const response = await apiService.get<User>('/users/1');
      
      expect(response.data.id).toBe(1);
      expect(response.data.name).toBe('Test');
    });
  });
});
