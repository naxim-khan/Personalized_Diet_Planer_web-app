// app/diet-plan/page.tsx
import DietPlanInterface from "../../../components/Dashboard/DietPlanInterface";
import { generateDietPlan } from "../../../lib/actions/dietplan.action";
import HeaderBox from "../../../components/Dashboard/HeaderBox";

export default function DietPlanPage() {
  return (
    <section
      className='home rounded-tl-2xl border border-gray-300 w-full h-screen mt-1'
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
            subtext="View Your  Plan or Generate New One"
          />
          <DietPlanInterface generatePlan={generateDietPlan} />
        </header>
      </div>
    </section>
  );
}