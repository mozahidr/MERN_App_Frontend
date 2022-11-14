import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const authStore = (user) => ({
    userProfile: null,

    addUser: (user) => Set({ userProfile: user })
});

const useAuthStore = create(
    persist(authStore, {
        name: 'auth'
    })
)

export default useAuthStore;