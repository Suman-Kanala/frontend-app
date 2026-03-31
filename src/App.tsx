import React, { lazy, Suspense } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute, RoleRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load pages
const Hero = lazy(() => import("@/components/Hero"));
const About = lazy(() => import("@/components/About"));
const Industries = lazy(() => import("@/components/Industries"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const GlobalPresence = lazy(() => import("@/components/GlobalPresence"));
const Contact = lazy(() => import("@/components/Contact"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const AIProgram = lazy(() => import("./pages/AIProgram"));
const AIChatbot = lazy(() => import("@/components/AIChatbot"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Payment = lazy(() => import("./pages/Payment"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const InterviewSupport = lazy(() => import("./pages/InterviewSupport"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses"));
const AdminVideos = lazy(() => import("./pages/admin/AdminVideos"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminInterviewSupport = lazy(() => import("./pages/admin/AdminInterviewSupport"));
const AdminMonitoring = lazy(() => import("./pages/admin/AdminMonitoring"));
const SignInPage = lazy(() => import("./pages/SignIn"));
const SignUpPage = lazy(() => import("./pages/SignUp"));
const SSOCallback = lazy(() => import("./pages/SSOCallback"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Helmet>
        <title>
          Saanvi Careers - Careers Connected | Professional Employment Services
        </title>
        <meta
          name="description"
          content="Saanvi Careers connects talent with opportunities across IT, Engineering, Healthcare, Finance sectors in India, USA, UK, Australia, EU and Gulf Countries. Professional employment services for job seekers and employers."
        />
      </Helmet>
      <Hero />
      <Contact />
      <About />
      <Industries />
      <HowItWorks />
      <GlobalPresence />
      <Testimonials />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AuthProvider>
            <div
              className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 overflow-x-hidden transition-colors duration-300"
              style={{ perspective: "1000px" }}
            >
              <Header />
              <main className="pt-16">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />
                    <Route path="/sso-callback" element={<SSOCallback />} />
                    <Route path="/ai-program" element={<AIProgram />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:slug" element={<CourseDetail />} />
                    <Route path="/payment/:courseId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/interview-support" element={<ProtectedRoute><InterviewSupport /></ProtectedRoute>} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/courses" element={<RoleRoute roles={['admin', 'instructor']}><AdminCourses /></RoleRoute>} />
                    <Route path="/admin/courses/:courseId/videos" element={<RoleRoute roles={['admin', 'instructor']}><AdminVideos /></RoleRoute>} />
                    <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                    <Route path="/admin/interview-support" element={<AdminRoute><AdminInterviewSupport /></AdminRoute>} />
                    <Route path="/admin/monitoring" element={<AdminRoute><AdminMonitoring /></AdminRoute>} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <Toaster />
            </div>
            <Suspense fallback={null}>
              <AIChatbot />
            </Suspense>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
