'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuestionnairePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the study page since all questionnaire functionality is now there
    router.replace('/dashboard/student/study');
  }, [router]);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto flex justify-center items-center min-h-screen">
      <p className="text-xl text-slate-600">Redirecting to study page...</p>
    </div>
  );
}
