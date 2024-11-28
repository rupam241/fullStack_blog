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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        
        {/* Protecting Dashboard route with PrivateRoute */}
        <Route element={<PrivateRoute />}> 
          <Route path="dashboard" element={<DashBoard />} />
        </Route>
       
        <Route path="projects" element={<Projects />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
