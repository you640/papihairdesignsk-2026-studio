'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { PhdButton } from '@/components/ui/PhdButton';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useUser, initiateSignOut } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, User } from 'lucide-react';

export default function Header({ dictionary }: { dictionary: any }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();
  const { user, isUserLoading, isAdmin } = useUser();
  const router = useRouter();
  
  const bookingUrl = `https://services.bookio.com/papi-hair-design/widget?lang=sk`;
  const obchodUrl = `http://www.goldhaircare.sk/affiliate/2208`;

  const handleLogout = () => {
    initiateSignOut();
    router.push('/home');
  };
  
  const navLinks = [
    { href: '/home', label: dictionary.home },
    { href: bookingUrl, label: dictionary.booking, target: '_blank' },
    { href: '/onas', label: "O nás" },
    { href: '/blog', label: dictionary.blog },
    { href: obchodUrl, label: dictionary.shop, target: '_blank' },
    { href: '/cennik', label: dictionary.pricelist },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-brand-secondary h-20">
      <div className="container flex h-full items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <div className="flex items-center gap-4">
            <Link href="/home" className="flex items-center">
                <Image
                  src="https://cloud.papihairdesign.sk/wp-content/uploads/2025/10/logo-e1761780357968.png"
                  alt="PAPI Hair DESIGN Logo"
                  width={50}
                  height={50}
                  quality={100}
                  className="h-9 w-auto"
                  priority
                />
            </Link>
        </div>


        {/* Desktop Navigation (Centered) */}
        <nav className="hidden md:flex items-center justify-center space-x-4 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.target}
              rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Actions & Mobile Trigger (Right Aligned) */}
        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />
          {isUserLoading ? (
             <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="Otvoriť používateľské menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{dictionary.my_account}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/profile">{dictionary.profile}</Link></DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem asChild><Link href="/admin">Admin Panel</Link></DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>{dictionary.logout}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link href="/login" aria-label="User Account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}

          <PhdButton asChild className="hidden lg:flex">
            <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">{dictionary.booking}</Link>
          </PhdButton>

          {/* Mobile Trigger */}
          <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Otvoriť navigačné menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 bg-brand-secondary">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-primary/20">
                      <Link href="/home" className="flex items-center space-x-2" onClick={() => setIsSheetOpen(false)}>
                           <Image
                                src="https://cloud.papihairdesign.sk/wp-content/uploads/2025/10/logo-e1761780357968.png"
                                alt="PAPI Hair DESIGN Logo"
                                width={56}
                                height={56}
                                quality={100}
                                className="h-10 w-auto"
                            />
                           <span className="font-headline text-lg font-bold">PAPI Hair DESIGN</span>
                      </Link>
                    </div>
                    <nav className="flex flex-col items-start p-4 space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          target={link.target}
                          rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            'text-lg font-medium transition-colors hover:text-primary w-full p-3 rounded-md',
                            pathname === link.href ? 'text-primary bg-primary/10' : 'text-foreground'
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                        <div className="w-full pt-4">
                         {!isUserLoading && !user && (
                            <Button variant="outline" asChild className="w-full" onClick={() => setIsSheetOpen(false)}>
                                <Link href="/login">
                                    <User className="mr-2 h-4 w-4" />
                                    Prihlásiť sa
                                </Link>
                            </Button>
                         )}
                        </div>
                    </nav>
                    <div className="mt-auto p-4 border-t border-primary/20">
                      <PhdButton asChild className="w-full" onClick={() => setIsSheetOpen(false)}>
                        <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">{dictionary.booking}</Link>
                      </PhdButton>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
