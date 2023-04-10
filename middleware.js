export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard', '/new-combo', '/new-flatground-trick', '/new-grind', '/new-manual', '/profile'],
}; // Must be authenticated to access these pages
