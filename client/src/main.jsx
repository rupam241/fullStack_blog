import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import DashBoard from './pages/DashBoard.jsx';
import Projects from './pages/Projects.jsx';
import Layout from './Layout.jsx';
import { Provider } from 'react-redux';
import store, { persistor } from './app/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from '../provider/ThemeProvider.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute.jsx';
import CreatePost from './pages/CreatePost.jsx';
import UpdatePost from './pages/UpdatePost.jsx';
import PostPage from './pages/PostPage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Search from './pages/Search.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path='/search' element={<Search />} />

        {/* Protected Dashboard */}
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<DashBoard />} />
        </Route>

        {/* Admin-only Routes */}
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="create-post" element={<CreatePost />} />
          <Route path="update-post/:postId" element={<UpdatePost />} />
        </Route>

        <Route path="projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <RouterProvider router={router}>
            <ScrollToTop />
          </RouterProvider>
        </PersistGate>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
