'use client';

import { useFirestore, useCollection } from '@/firebase';
import { collection, CollectionReference } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Scissors, Users, Newspaper, Package } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    href: string;
    isLoading: boolean;
}

const StatCard = ({ title, value, icon: Icon, href, isLoading }: StatCardProps) => {
    if (isLoading) {
        return (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-24 mt-2" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                 <Link href={href} className="text-xs text-muted-foreground flex items-center hover:text-primary transition-colors">
                    Spravovať <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
            </CardContent>
        </Card>
    );
};


export default function AdminDashboardPage() {
    const firestore = useFirestore();

    const servicesCollection = useMemo(() => firestore ? collection(firestore, 'services') as CollectionReference : null, [firestore]);
    const stylistsCollection = useMemo(() => firestore ? collection(firestore, 'stylists') as CollectionReference : null, [firestore]);
    const blogPostsCollection = useMemo(() => firestore ? collection(firestore, 'blogPosts') as CollectionReference : null, [firestore]);
    const productsCollection = useMemo(() => firestore ? collection(firestore, 'products') as CollectionReference : null, [firestore]);

    const { data: services, isLoading: isLoadingServices } = useCollection(servicesCollection);
    const { data: stylists, isLoading: isLoadingStylists } = useCollection(stylistsCollection);
    const { data: blogPosts, isLoading: isLoadingBlog } = useCollection(blogPostsCollection);
    const { data: products, isLoading: isLoadingProducts } = useCollection(productsCollection);

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Služby" 
                    value={services?.length || 0} 
                    icon={Scissors} 
                    href="/admin/services"
                    isLoading={isLoadingServices} 
                />
                <StatCard 
                    title="Štylisti" 
                    value={stylists?.length || 0} 
                    icon={Users} 
                    href="/admin/stylists"
                    isLoading={isLoadingStylists} 
                />
                 <StatCard 
                    title="Blogové príspevky" 
                    value={blogPosts?.length || 0} 
                    icon={Newspaper} 
                    href="/admin/blog"
                    isLoading={isLoadingBlog} 
                />
                 <StatCard 
                    title="Produkty" 
                    value={products?.length || 0} 
                    icon={Package} 
                    href="/admin/products"
                    isLoading={isLoadingProducts} 
                />
            </div>
        </div>
    );
}
