import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "./context/AuthContext";
import Homepage from './pages/Homepage'
import SalesLog from './pages/SalesLog'
import Reports from './pages/Reports'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast';
import './App.css'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; 
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/HomePage"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            } />
          <Route path="/SalesLog"
            element={
              <ProtectedRoute>
                <SalesLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
