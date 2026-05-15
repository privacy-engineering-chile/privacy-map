import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const url = `https://atlas.privacyengineering.cl${location.pathname}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Helmet>
        <title>404 — Page Not Found | Privacy Atlas</title>
        <meta name="description" content="The page you're looking for doesn't exist on Privacy Atlas." />
        <link rel="canonical" href={url} />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="404 — Page Not Found | Privacy Atlas" />
        <meta property="og:description" content="The page you're looking for doesn't exist on Privacy Atlas." />
        <meta property="og:url" content={url} />
      </Helmet>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
