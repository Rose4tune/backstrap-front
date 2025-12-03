// src/hooks/useAICVRedirect.ts
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '@stores/useStore.hook';

export const useAICVRedirect = (accessToken?: string) => {
    const router = useRouter();
    const { MeStore } = useStore();

    const redirectToAICV = useCallback(() => {
        if (MeStore.isEmpty()) {
            router.push('https://career.bagstrap.team/');
            return;
        }

        router.replace(`https://career.bagstrap.team/?token=${accessToken}`);
    }, [MeStore, router, accessToken]); // ✅ accessToken도 deps에 포함

    return redirectToAICV;
};
