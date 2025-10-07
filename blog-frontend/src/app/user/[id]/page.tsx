'use client';

import { UserProfile } from '../../components/features/UserProfile';
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserPage({ params }: PageProps) {
  const { id } = use(params);

  return <UserProfile userId={id} />;
}


