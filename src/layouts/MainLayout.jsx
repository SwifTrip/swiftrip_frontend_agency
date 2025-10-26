import React from 'react';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white shadow">
        <div className="max-w-6xl mx-auto">Main Header</div>
      </header>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
