
'use client';

import { Award, Scissors, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

const features = [
    {
        icon: Award,
        title: "Prvotriedna kvalita",
        description: "Používame len tie najlepšie produkty a techniky, aby sme zaručili dokonalý výsledok pre vaše vlasy."
    },
    {
        icon: Users,
        title: "Skúsení štylisti",
        description: "Náš tím tvoria talentovaní a kreatívni profesionáli s rokmi skúseností a vášňou pre vlasový dizajn."
    },
    {
        icon: Scissors,
        title: "Personalizovaný prístup",
        description: "Každému klientovi sa venujeme individuálne. Vypočujeme vaše predstavy a poradíme vám štýl, ktorý vám pristane."
    }
]

export function FeaturesGrid({ dictionary }: { dictionary: any }) {
    
    // Map dictionary titles and descriptions to features
    const localizedFeatures = features.map((feature, index) => ({
        ...feature,
        title: dictionary.features[index]?.title || feature.title,
        description: dictionary.features[index]?.description || feature.description
    }));

    return (
        <section className="py-16 lg:py-24">
            <div className="text-center">
                <Badge variant="outline" className="mb-4">{dictionary.badge}</Badge>
                <h2 className="font-headline text-3xl font-bold md:text-4xl">{dictionary.title}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    {dictionary.subtitle}
                </p>
            </div>
            
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {localizedFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <Card key={index} className="text-center transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                            <CardHeader>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </section>
    )
}
