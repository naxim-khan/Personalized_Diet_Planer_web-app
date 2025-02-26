import { DietPlanTypes } from "../../../types/index";
export function AdditionalSection({ dietPlan }: { dietPlan: DietPlanTypes }) {
    return (
        <div className="grid gap-px grid-cols-2 md:grid-cols-1 lg:grid-cols-2 bg-gray-100/50 rounded-lg overflow-hidden border border-gray-200">
            {/* Foods to Avoid */}
            {(dietPlan.foods_to_avoid ?? []).length > 0 && (
                <div className="bg-white p-4">
                    <div className="flex flex-col space-y-2">
                        <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                            <span className="border-b-2 border-red-100 pb-1">Foods to Avoid</span>
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {dietPlan.foods_to_avoid?.map((food, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium bg-red-50/60 text-red-700 rounded-md border border-red-200"
                                >
                                    {food}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Ingredients List */}
            {dietPlan.all_ingredients && dietPlan.all_ingredients.length > 0 && (
                <div className="bg-white p-4">
                    <div className="flex flex-col space-y-2">
                        <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                            <span className="border-b-2 border-emerald-100 pb-1">Ingredients Included in Plan</span>
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {dietPlan.all_ingredients.map((ingredient, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium bg-emerald-50/60 text-emerald-700 rounded-md border border-emerald-200"
                                >
                                    {ingredient}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}