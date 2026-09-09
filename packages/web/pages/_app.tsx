import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryProvider } from '@/lib/query-provider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <Component {...pageProps} />
    </QueryProvider>
  );
}
