import { lazy } from 'react';

const lazyWithPreload = factory => {
    const promise = factory();
    return lazy(() => promise);
}

export default lazyWithPreload;