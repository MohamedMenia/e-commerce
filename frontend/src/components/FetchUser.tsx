"use client";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import useUser from '@/hooks/useUser';

const FetchUser = () => {
  const dispatch = useDispatch();
  const { data: user, isLoading, error } = useUser();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user.data));
    }
  }, [user, dispatch]);

  if (isLoading || error) {
    return null;
  }

  return null;
};

export default FetchUser;
