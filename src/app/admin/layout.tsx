'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

import { Home, Scissors, Users, LayoutDashboard, LogOut, Package, Newspaper } from 'lucide-react';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading, isAdmin, isAdminLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  
  useEffect(() => {
    if (!isUserLoading && !isAdminLoading) {
      if (!user) {
        router.push(`/login`);
      } else if (!isAdmin) {
        router.push(`/home`);
      }
    }
  }, [user, isUserLoading, isAdmin, isAdminLoading, router]);
  
  if (isUserLoading || isAdminLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const adminNavLinks = [
    { href: `/admin/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/admin/services`, label: 'Služby', icon: Scissors },
    { href: `/admin/stylists`, label: 'Štylisti', icon: Users },
    { href: `/admin/blog`, label: 'Blog', icon: Newspaper },
    { href: `/admin/products`, label: 'Produkty', icon: Package },
  ];

  const handleLogout = async () => {
    if (auth) {
        await signOut(auth);
        router.push(`/home`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 flex-shrink-0 bg-card p-4">
        <div className="flex h-full flex-col">
          <h2 className="mb-8 text-2xl font-bold font-headline text-primary">Admin Panel</h2>
          <nav className="flex-grow">
            <ul className="space-y-2">
              {adminNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} legacyBehavior>
                    <a
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                        pathname === link.href ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'border-r-4 border-transparent'
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <Link href={`/home`} legacyBehavior>
              <a className="mb-4 flex items-center gap-3 rounded-md px-3 py-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                <Home className="h-5 w-5" />
                <span>Späť na stránku</span>
              </a>
            </Link>
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 px-3 hover:bg-destructive/80 hover:text-destructive-foreground">
              <LogOut className="h-5 w-5" />
              <span>Odhlásiť sa</span>
            </Button>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-8 md:p-10">{children}</main>
    </div>
  );
}
