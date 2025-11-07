
'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Appointment } from '@/lib/types';
import { collection, query, where, orderBy, CollectionReference, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { PhdButton } from '@/components/ui/PhdButton';
import { timestampToDate } from '@/lib/date-utils';

type MappedAppointment = Omit<Appointment, 'startTime' | 'endTime'> & {
  startTime: Date;
  endTime: Date;
}

export default function ProfilePage() {
  const { user, isUserLoading, isAdmin } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push(`/login`);
    }
  }, [user, isUserLoading, router]);

  const appointmentsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'appointments'),
      where('userId', '==', user.uid),
      orderBy('startTime', 'desc')
    ) as CollectionReference<Appointment>;
  }, [firestore, user]);

  const { data: appointments, isLoading: isLoadingAppointments } = useCollection<Appointment>(appointmentsQuery);

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date();
    if (!appointments) {
        return { upcomingAppointments: [], pastAppointments: [] };
    }
    const allAppts: MappedAppointment[] = appointments.map(appt => ({
        ...appt,
        startTime: timestampToDate(appt.startTime),
        endTime: timestampToDate(appt.endTime),
    }));

    return {
      upcomingAppointments: allAppts.filter(a => a.startTime >= now) || [],
      pastAppointments: allAppts.filter(a => a.startTime < now) || [],
    };
  }, [appointments]);

  if (isUserLoading || !user) {
    return (
      <div className="py-12">
        <div>
          <Card className="mb-8">
            <CardHeader className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start">
              <Skeleton className="h-24 w-24 rounded-full mb-4 sm:mb-0 sm:mr-6" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-64" />
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push(`/`);
    }
  };
  
  const AppointmentCard = ({ appt }: { appt: MappedAppointment }) => (
    <div className="flex justify-between items-start p-4 border-b">
        <div>
            <p className="font-semibold">{appt.serviceName}</p>
            <p className="text-sm text-muted-foreground">s {appt.stylistName}</p>
            <p className="text-sm text-muted-foreground">{format(appt.startTime, 'd. M. yyyy')} o {format(appt.startTime, 'HH:mm')}</p>
        </div>
        <div className="text-right">
             <p className="font-semibold">{new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(appt.price)}</p>
             <p className="text-sm capitalize text-muted-foreground">{appt.status}</p>
        </div>
    </div>
  );


  return (
    <div className="py-12">
      <div>
        <Card className="mb-8">
          <CardHeader className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start p-4 md:p-6">
            <Avatar className="h-24 w-24 mb-4 sm:mb-0 sm:mr-6">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <CardTitle className="text-3xl font-headline">{user.displayName || 'PAPI Používateľ'}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
               {isAdmin && (
                <PhdButton onClick={() => router.push(`/admin`)} className="mt-4">
                  Admin Panel
                </PhdButton>
              )}
            </div>
            <Button variant="ghost" onClick={handleLogout} className="mt-4 sm:mt-0">Odhlásiť sa</Button>
          </CardHeader>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Moje rezervácie</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoadingAppointments ? (
                     <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold mb-2">Nadchádzajúce</h3>
                        {upcomingAppointments.length > 0 ? (
                            <div className="divide-y rounded-md border">
                                {upcomingAppointments.map(appt => <AppointmentCard key={appt.id} appt={appt} />)}
                            </div>
                        ) : (
                            <p className="text-muted-foreground p-4 text-center border rounded-md">Nemáte žiadne nadchádzajúce rezervácie.</p>
                        )}
                        
                        <h3 className="text-lg font-semibold mt-8 mb-2">Minulé</h3>
                        {pastAppointments.length > 0 ? (
                            <div className="divide-y rounded-md border">
                                {pastAppointments.map(appt => <AppointmentCard key={appt.id} appt={appt} />)}
                            </div>
                        ) : (
                            <p className="text-muted-foreground p-4 text-center border rounded-md">Nemáte žiadne minulé rezervácie.</p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
