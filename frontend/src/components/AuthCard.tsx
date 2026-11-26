import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface AuthCardProps {
  onSuccessLogin: (identifier: string) => void;
}

type AuthMode = 'phone' | 'email';

export const AuthCard: React.FC<AuthCardProps> = ({ onSuccessLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('phone');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const targetDestination =
    authMode === 'phone'
      ? `+237 ${phone.trim() || '6XX XXX XXX'}`
      : email.trim() || 'trader@237marketprices.cm';

  const handleSendOrResendCode = (isResend = false) => {
    if (isSendingCode || resendCooldown > 0) return;
    setIsSendingCode(true);
    setStatusMessage('');

    setTimeout(() => {
      setIsSendingCode(false);
      setOtpSent(true);
      setResendCooldown(30);
      setStatusMessage(
        isResend
          ? `Verification code resent to ${targetDestination}.`
          : `6-digit verification code sent to ${targetDestination}.`
      );
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSigningIn) return;
    setIsSigningIn(true);

    setTimeout(() => {
      setIsSigningIn(false);
      onSuccessLogin(targetDestination);
    }, 550);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200/90 bg-white p-6 sm:p-8">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-mint-200 bg-mint-50 font-num text-xs font-bold text-forest-900">
        237
      </div>

      <div className="mt-4 text-center">
        <p className="font-num text-[10px] font-semibold tracking-widest text-forest-800 uppercase">
          Cameroon Agronomic Portal
        </p>
        <h1 className="font-display mt-1 text-xl font-extrabold tracking-tight text-gray-900">
          Sign in to 237MarketPrices
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Track real-time commodity rates and submit prices across Cameroon.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 rounded-lg border border-gray-200 bg-gray-50 p-1 text-xs font-semibold">
        <button
          type="button"
          disabled={isSigningIn}
          onClick={() => setAuthMode('phone')}
          className={`cursor-pointer rounded-md py-2 transition disabled:opacity-50 ${
            authMode === 'phone'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Phone (237)
        </button>
        <button
          type="button"
          disabled={isSigningIn}
          onClick={() => setAuthMode('email')}
          className={`cursor-pointer rounded-md py-2 transition disabled:opacity-50 ${
            authMode === 'email'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Email
        </button>
      </div>

      {statusMessage && (
        <div className="mt-4 rounded-lg border border-mint-200 bg-mint-50 px-3 py-2 text-[11px] font-medium text-forest-900">
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {authMode === 'phone' ? (
          <div>
            <label className="block text-xs font-semibold text-gray-800">
              Mobile Phone Number
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2.5 transition focus-within:border-forest-700 focus-within:bg-white">
              <span className="font-num border-r border-gray-200 pr-2 text-xs font-bold text-gray-700">
                +237
              </span>
              <input
                type="tel"
                disabled={isSigningIn}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="6XX XXX XXX"
                className="font-num w-full bg-transparent text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-60"
              />
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              MTN Cameroon &amp; Orange Cameroun supported
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-gray-800">
              Email Address
            </label>
            <input
              type="email"
              disabled={isSigningIn}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@237marketprices.cm"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-xs font-medium text-gray-900 placeholder-gray-400 transition focus:border-forest-700 focus:bg-white focus:outline-none disabled:opacity-60"
            />
          </div>
        )}

        {otpSent && (
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">
                6-Digit Verification Code
              </label>
              <button
                type="button"
                disabled={isSendingCode || resendCooldown > 0}
                onClick={() => handleSendOrResendCode(true)}
                className="font-num cursor-pointer text-[11px] font-semibold text-forest-800 underline hover:text-forest-950 disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
              >
                {isSendingCode
                  ? 'Resending...'
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend Code'}
              </button>
            </div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              disabled={isSigningIn}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="font-num mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-xs font-bold tracking-[0.25em] text-gray-900 placeholder-gray-400 transition focus:border-forest-700 focus:bg-white focus:outline-none disabled:opacity-60"
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-800">
              Password
            </label>
            <button
              type="button"
              disabled={isSendingCode || resendCooldown > 0}
              onClick={() => handleSendOrResendCode(otpSent)}
              className="cursor-pointer text-[11px] font-semibold text-forest-800 underline hover:text-forest-950 disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
            >
              {resendCooldown > 0
                ? `Code sent (${resendCooldown}s)`
                : 'Use 6-digit SMS OTP'}
            </button>
          </div>

          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2.5 transition focus-within:border-forest-700 focus-within:bg-white">
            <input
              type={showPassword ? 'text' : 'password'}
              disabled={isSigningIn}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your security password"
              className="w-full bg-transparent text-xs text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-60"
            />
            <button
              type="button"
              disabled={isSigningIn}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="cursor-pointer text-gray-400 transition hover:text-gray-700 disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Eye className="h-3.5 w-3.5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex cursor-pointer items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              disabled={isSigningIn}
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="h-3.5 w-3.5 rounded accent-forest-900"
            />
            <span>Remember this device</span>
          </label>
          <button
            type="button"
            disabled={isSendingCode || resendCooldown > 0}
            onClick={() => handleSendOrResendCode(true)}
            className="cursor-pointer font-medium text-gray-500 transition hover:text-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Forgot Password?'}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSigningIn || isSendingCode}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-forest-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          {isSigningIn && (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.2} />
          )}
          <span>{isSigningIn ? 'Signing In...' : 'Sign In to Dashboard'}</span>
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 font-num text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
        <div className="h-px flex-1 bg-gray-200" />
        <span>OR</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <button
        type="button"
        disabled={isSendingCode || isSigningIn || resendCooldown > 0}
        onClick={() => handleSendOrResendCode(otpSent)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSendingCode && (
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
        )}
        <span className={resendCooldown > 0 ? 'font-num' : ''}>
          {isSendingCode
            ? 'Sending SMS Code...'
            : resendCooldown > 0
              ? `Resend SMS Code in ${resendCooldown}s`
              : otpSent
                ? 'Resend SMS Verification Code'
                : 'Quick Login with SMS Code'}
        </span>
      </button>

      <p className="mt-4 text-center text-xs text-gray-600">
        Don&apos;t have a trader account?{' '}
        <button
          type="button"
          disabled={isSendingCode || isSigningIn}
          onClick={() => handleSendOrResendCode(false)}
          className="cursor-pointer font-bold text-forest-800 hover:underline disabled:opacity-50"
        >
          Register for free
        </button>
      </p>

      <div className="mt-4 rounded-lg border border-mint-200/90 bg-mint-50/70 p-3 text-[11px] text-gray-600">
        Access for registered brokers, market masters &amp; agricultural
        cooperatives across Central Africa.
      </div>
    </div>
  );
};