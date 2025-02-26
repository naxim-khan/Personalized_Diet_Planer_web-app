import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export function Header({ userData }: { userData: any }) {
    return (
        <Card className="bg-background rounded-none border-0 shadow-sm">
            <CardContent className="px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center gap-4 md:gap-6">
                    {/* Logo with subtle accent */}
                    <div className="flex items-center">
                        <img
                            src="/img/LOGO.png"
                            alt="Site Logo"
                            className="h-10 md:h-12 w-auto"
                        />
                        <div className="ml-2 h-8 w-px bg-emerald-200/80 hidden md:block"></div>
                    </div>

                    {/* Title with gradient text */}
                    <div className="flex-1">
                        <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                            Personalized Nutrition Plan
                            <span className="block md:inline-block text-sm md:text-base font-normal text-emerald-600/90 mt-1 md:mt-0 md:ml-3">
                                {userData?.user?.fitnessGoal && `(Optimized for ${userData.user.fitnessGoal})`}
                            </span>
                        </h1>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}