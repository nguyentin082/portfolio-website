import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';

const Portrait = lazy(() => import('./components/Portrait'));
const MainContainer = lazy(() => import('./components/MainContainer'));
const MyWorks = lazy(() => import('./pages/MyWorks'));
const Play = lazy(() => import('./pages/Play'));
const NotFound = lazy(() => import('./pages/NotFound'));
import { LoadingProvider } from './context/LoadingProvider';
import SeasonalBackground from './components/SeasonalBackground';

const App = () => {
    return (
        <BrowserRouter>
            <SeasonalBackground />
            <Routes>
                <Route
                    path="/"
                    element={
                        <LoadingProvider>
                            <Suspense>
                                <MainContainer>
                                    <Suspense>
                                        <Portrait />
                                    </Suspense>
                                </MainContainer>
                            </Suspense>
                        </LoadingProvider>
                    }
                />
                <Route
                    path="/myworks"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <MyWorks />
                        </Suspense>
                    }
                />
                {/* <Route
                    path="/play"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <Play />
                        </Suspense>
                    }
                /> */}
                <Route
                    path="*"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <NotFound />
                        </Suspense>
                    }
                />
            </Routes>
            <Analytics />
            <SpeedInsights />
        </BrowserRouter>
    );
};

export default App;
