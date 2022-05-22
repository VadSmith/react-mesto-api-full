import React from 'react';
import { Link } from 'react-router-dom';


function PageNotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__header">404</h1>
      <p className="not-found__info">Page not found</p>
      <Link to="/" className="not-found__link">Back To Homepage</Link>
    </div>
  );
}

export default PageNotFound;