import { baseApi } from '../../services/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    jobs: builder.mutation({
      query: () => ({
        url: '/jobs',
        method: 'GET'
      }),
    })
  }),
});

export const { useJobsMutation } = authApi;

