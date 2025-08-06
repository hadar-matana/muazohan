import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import SongsPage from './pages/SongsPage';
import ArtistsPage from './pages/ArtistsPage';
import AlbumsPage from './pages/AlbumsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import AlbumDetailPage from './pages/AlbumDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/songs" replace />
      },
      {
        path: 'songs',
        element: <SongsPage />
      },
      {
        path: 'artists',
        element: <ArtistsPage />
      },
      {
        path: 'albums',
        element: <AlbumsPage />
      },
      {
        path: 'artists/:artistId',
        element: <ArtistDetailPage />
      },
      {
        path: 'albums/:albumId',
        element: <AlbumDetailPage />
      }
    ]
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
} 