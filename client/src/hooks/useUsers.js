import { useQuery} from '@tanstack/react-query';
import api from "../services/api";

export function useUsers(searchTerm) {
  return useQuery({
    queryKey: ['admin', 'users', searchTerm],
    queryFn: () => api.get(`/admin/users?search=${searchTerm}`).then(res => res.data),
    placeholderData: (prev) => prev,
  });
}