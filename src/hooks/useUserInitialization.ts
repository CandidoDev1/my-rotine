"use client";

import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { apiCall } from './useApi';

export function useUserInitialization() {
  const { user } = useAuth();

  useEffect(() => {
    const initializeUser = async () => {
      if (!user) return;

      try {
        // Initialize user preferences and categories
        await apiCall('/api/users/preferences/init', {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    initializeUser();
  }, [user]);
}
