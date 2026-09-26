import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

interface Props {
  email?: string | null;
  success: boolean;
}

export default function UnsubscribeSuccess({ email, success }: Props) {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex items-center justify-center p-6">
      <Head title="Newsletter Unsubscribe | DevCenterPoint Studio" />

      <div className="max-w-md w-full bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        {success ? (
          <>
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Unsubscribed Successfully</h1>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {email ? (
                <span>
                  <strong className="text-slate-200">{email}</strong> has been removed from our newsletter distribution list. You will no longer receive marketing communications from us.
                </span>
              ) : (
                'You have been successfully removed from our newsletter updates.'
              )}
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Invalid or Expired Link</h1>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              We could not find an active subscription associated with this unsubscribe token. You may already be unsubscribed.
            </p>
          </>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-semibold transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Return to DevCenterPoint Studio
        </Link>
      </div>
    </div>
  );
}
