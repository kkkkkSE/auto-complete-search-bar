import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://localhost:4000/';

export default class ApiService {
  #instance : AxiosInstance;

  constructor() {
    this.#instance = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  async fetchSickList({ searchText }: {
    searchText: string;
  }) {
    const { data } = await this.#instance.get('/sick', {
      params: {
        q: searchText,
      },
    });

    console.info('calling api');

    return data;
  }
}

export const apiService = new ApiService();
