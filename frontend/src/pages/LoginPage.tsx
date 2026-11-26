import React from 'react';
import { AuthCard } from '../components/AuthCard';

interface LoginPageProps {
  onSuccessLogin: (identifier: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccessLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-8">
      <AuthCard onSuccessLogin={onSuccessLogin} />

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-500">
        <span>Support Desk</span>
        <span>•</span>
        <span>Privacy Charter</span>
        <span>•</span>
        <span className="font-num font-semibold text-gray-700">
          USSD Access (#237*1#)
        </span>
      </div>
    </div>
  );
};

export default LoginPage;