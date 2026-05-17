import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Check, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { setOnboarded } from '../../lib/demoState';

type Step = 'phone' | 'code' | 'verified';

/**
 * One-screen onboarding stub. Tarmil's brief mandates phone + email
 * verification before a user enters the social layer; this surface
 * communicates the intent without wiring real SMS. The "Verified ✓"
 * step routes into the app and flips `hasOnboarded` so subsequent
 * launches skip it.
 */
export function WelcomeScreen() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const phoneOk = phone.replace(/\D/g, '').length >= 7;
  const codeOk = code.replace(/\D/g, '').length === 4;

  const handleEnter = () => {
    setOnboarded(true);
    navigate('/trip', { replace: true });
  };

  return (
    <Screen>
      <div className="flex min-h-full flex-col gap-lg p-md pb-xl">
        <header className="flex flex-col gap-sm pt-xl">
          <span className="meta-caps text-copper">Welcome</span>
          <h1 className="font-serif text-display leading-none text-cocoa">
            Tarmil
          </h1>
          <p className="max-w-body text-body leading-snug text-cocoa-70">
            Friends, plans, and places — for everywhere you're going next.
            Verified by phone. Visible only to people you choose.
          </p>
        </header>

        {step === 'phone' && (
          <section className="flex flex-col gap-md rounded-2xl bg-sand shadow-card p-md">
            <div className="flex items-center gap-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cocoa text-ivory">
                <Phone className="h-5 w-5" strokeWidth={1.7} aria-hidden />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-lede italic text-cocoa">
                  Verify your phone
                </span>
                <span className="text-small text-cocoa-70">
                  We'll text you a 4-digit code. Standard rates apply.
                </span>
              </div>
            </div>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+972 50 123 4567"
              className="h-12 w-full rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
            />
            <Button
              variant="accent"
              fullWidth
              onClick={() => setStep('code')}
              disabled={!phoneOk}
            >
              Send code
            </Button>
          </section>
        )}

        {step === 'code' && (
          <section className="flex flex-col gap-md rounded-2xl bg-sand shadow-card p-md">
            <div className="flex items-center gap-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cocoa text-ivory">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.7} aria-hidden />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-lede italic text-cocoa">
                  Enter your code
                </span>
                <span className="text-small text-cocoa-70">
                  Sent to {phone || 'your phone'}. Demo build — any 4 digits.
                </span>
              </div>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              maxLength={4}
              className="h-14 w-full rounded-full border border-cocoa-15 bg-ivory px-md text-center text-display tnum tracking-widest text-cocoa placeholder:text-cocoa-30 focus:border-copper focus:outline-none"
            />
            <Button
              variant="accent"
              fullWidth
              onClick={() => setStep('verified')}
              disabled={!codeOk}
            >
              Verify
            </Button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="text-small text-copper transition-colors duration-instant ease-out-quart hover:text-copper-85"
            >
              Edit phone number
            </button>
          </section>
        )}

        {step === 'verified' && (
          <section className="flex flex-col items-center gap-md rounded-2xl bg-sand shadow-card p-md">
            <span
              className={clsx(
                'inline-flex h-16 w-16 items-center justify-center rounded-full',
                'bg-copper text-ivory shadow-card',
              )}
            >
              <Check className="h-8 w-8" strokeWidth={2.4} aria-hidden />
            </span>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="font-serif text-sub italic leading-tight text-cocoa">
                Verified
              </span>
              <p className="text-small leading-snug text-cocoa-70">
                You're in. Tarmil now knows it's really you — friends will
                see you the moment you accept their request.
              </p>
            </div>
            <Button variant="accent" fullWidth onClick={handleEnter}>
              Open my trip
            </Button>
          </section>
        )}

        <p className="text-small leading-snug text-cocoa-55">
          Tarmil never sells your data. City-level visibility only. Friends
          on Tarmil are people you actually know.
        </p>
      </div>
    </Screen>
  );
}
