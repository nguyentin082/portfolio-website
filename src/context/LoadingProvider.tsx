import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react';
import Loading from '../components/Loading';
import { isDesktopLayout } from '../components/utils/layout';

interface LoadingType {
    isLoading: boolean;
    setIsLoading: (state: boolean) => void;
    setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
    const [isLoading, setIsLoading] = useState(() => {
        // Must match where MainContainer mounts Portrait: outside the desktop
        // layout no portrait loads, so nothing drives the progress and the
        // loading screen would hang at 0% forever.
        return isDesktopLayout();
    });
    const [loading, setLoading] = useState(0);

    const value = {
        isLoading,
        setIsLoading,
        setLoading,
    };
    useEffect(() => {
        // No portrait here, so run the intro animation directly
        if (!isDesktopLayout()) {
            import('../components/utils/initialFX').then((module) => {
                if (module.initialFX) {
                    setTimeout(() => {
                        module.initialFX();
                    }, 100);
                }
            });
        }
    }, []);

    useEffect(() => {}, [loading]);

    return (
        <LoadingContext.Provider value={value as LoadingType}>
            {isLoading && <Loading percent={loading} />}
            <main className="main-body">{children}</main>
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
