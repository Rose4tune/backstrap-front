import { useEffect } from 'react';

/**
 * body 스크롤을 막고 싶을 때 사용하는 훅
 * @param isScrollForbidden true일 때 body 스크롤을 막음
 */
export function useDimScrollForbidden(isScrollForbidden: boolean) {
    useEffect(() => {
        if (isScrollForbidden) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isScrollForbidden]);
}
