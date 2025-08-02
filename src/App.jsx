import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import RedirectLink from './pages/Redirect';
import LandingPage from './pages/LandingPage';
import DashBoard from './pages/DashBoard';
import LinkPage from './pages/Link';
import Auth from './pages/Auth';
import UrlProvider from './Context';
import RequireAuth from './components/RequiredAuth';

const router = createBrowserRouter([
  {
    element: <AppLayout />, 
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/dashboard',
        element: (
            <RequireAuth>
              <DashBoard />
          </RequireAuth>
        ),
      },
      {
        path: '/link/:id',
        element: (
           <RequireAuth>
            <LinkPage />
          </RequireAuth>
        ),
      },
      {
        path: '/:id',
        element: <RedirectLink />,
      },
    ],
  },
]);

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;