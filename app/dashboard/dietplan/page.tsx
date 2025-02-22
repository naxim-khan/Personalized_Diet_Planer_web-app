// app/diet-plan/page.tsx
import DietPlanInterface from "@/components/Dashboard/DietPlanInterface";
import { generateDietPlan } from "@/lib/actions/dietplan.action";
import HeaderBox from "@/components/Dashboard/HeaderBox";

export default function DietPlanPage() {
  return (
    <section
      className='home rounded-tl-2xl border w-full h-screen'
      style={{
        backgroundColor: "#fafffb",
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/blizzard.png")',
        backgroundSize: "auto",
        backgroundRepeat: "repeat",
        minHeight: 'fit-content'
      }}>
      <div className="home-content">
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Generate Your"
            user={"Diet Plan"}
            subtext="View Your Ex"
          />
          <DietPlanInterface generatePlan={generateDietPlan} />
        </header>
      </div>
    </section>
  );
}