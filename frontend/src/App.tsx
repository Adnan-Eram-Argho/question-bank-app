import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FacultyProvider } from './context/FacultyContext';
import Layout from './components/Layout';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UploadQuestion from './components/UploadQuestion';
import QuestionList from './components/QuestionList';
import StudyMaterials from './components/StudyMaterials';
import Developer from './components/Developer';
import Contributors from './components/Contributors';
import Profile from './components/Profile';
import AnimatedBackground from './components/AnimatedBackground';
import PageTransition from './components/PageTransition';

// ১. এই লাইনটি নতুন যোগ করা হয়েছে
import { Analytics } from '@vercel/analytics/react'; 
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode, allowedRoles: string[] }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role || '')) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <FacultyProvider>
        <AuthProvider>
        <Router>
          <AnimatedBackground />
          <Layout>
            <PageTransition>
              <Routes>
                <Route path="/" element={<QuestionList />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'collector']}>
                      <UploadQuestion />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'collector']}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Public Info Routes */}
                <Route path="/study-materials" element={<StudyMaterials />} />
                <Route path="/developer" element={<Developer />} />
                <Route path="/contributors" element={<Contributors />} />
              </Routes>
            </PageTransition>
          </Layout>
        </Router>

        
        <Analytics /> 
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        </AuthProvider>
      </FacultyProvider>
    </ThemeProvider>
  );
}

export default App;