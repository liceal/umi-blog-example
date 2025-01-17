
export default {
  npmClient: 'pnpm',
  apiRoute: {
    platform: 'vercel'
  },
  routes: [
    { exact: true, path: '/', component: 'index' },
    { exact: true, path: '/register', component: 'register' },
    { exact: true, path: '/posts/create', component: 'posts/create' },
    { exact: true, path: '/posts/:postId/edit', component: 'posts/edit' },
    { exact: true, path: '/login', component: 'login' },
    { exact: true, path: '/posts/:postId', component: 'posts/post' },
  ],
  plugins: [require.resolve('@umijs/plugins/dist/tailwindcss')],
  tailwindcss: {},
  devtool: 'source-map',
};
