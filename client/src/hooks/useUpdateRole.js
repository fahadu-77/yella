import {useMutation, useQueryClient } from '@tanstack/react-query';
import api from "../services/api";

export function useUpdateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, newRole }) => 
      api.patch(`/admin/users/${userId}/role`, { role: newRole }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'users']);
    }
  });
}
