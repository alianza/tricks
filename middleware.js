export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard',
    '/new-combo',
    '/new-flatground-trick',
    '/new-grind',
    '/new-manual',
    '/profile',
    '/statistics',
    '/manuals/:id*',
    '/flatgroundtricks/:id*',
    '/grinds/:id*',
    '/combos/:id*',
  ],
}; // Must be authenticated to access these pages
