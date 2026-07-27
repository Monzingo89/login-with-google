import type { ButtonHTMLAttributes } from 'react';

export type GoogleLoginButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label?: string;
  pendingLabel?: string;
  pending?: boolean;
};

export function GoogleLoginButton({
  label = 'Continue with Google',
  pendingLabel = 'Opening Google…',
  pending = false,
  className = '',
  disabled,
  ...buttonProps
}: GoogleLoginButtonProps) {
  return (
    <button
      type="button"
      className={`lwg-google-button ${className}`.trim()}
      disabled={disabled || pending}
      aria-busy={pending}
      {...buttonProps}
    >
      <svg className="lwg-google-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M21.35 12.2c0-.64-.06-1.25-.16-1.84H12v3.48h5.25a4.5 4.5 0 0 1-1.95 2.95v2.26h3.16c1.85-1.7 2.89-4.22 2.89-6.85Z"
        />
        <path
          fill="#34A853"
          d="M12 21.73c2.64 0 4.86-.87 6.48-2.37l-3.16-2.45c-.88.59-2 .94-3.32.94-2.55 0-4.71-1.72-5.49-4.03H3.24v2.53A9.78 9.78 0 0 0 12 21.73Z"
        />
        <path
          fill="#FBBC05"
          d="M6.51 13.82A5.88 5.88 0 0 1 6.2 12c0-.63.11-1.24.31-1.82V7.65H3.24A9.77 9.77 0 0 0 2.2 12c0 1.57.38 3.05 1.04 4.35l3.27-2.53Z"
        />
        <path
          fill="#EA4335"
          d="M12 6.15c1.44 0 2.73.5 3.75 1.46l2.8-2.8A9.4 9.4 0 0 0 12 2.27a9.78 9.78 0 0 0-8.76 5.38l3.27 2.53C7.29 7.87 9.45 6.15 12 6.15Z"
        />
      </svg>
      <span>{pending ? pendingLabel : label}</span>
    </button>
  );
}
