import CategoryDropdowns from '../Components/HomeComponents/CategoryDropdowns';
import HeroBanner from '../Components/HomeComponents/HeroBanner';
import BestElectronics from '../Components/HomeComponents/BestElectronics';
import { ToysBeauty } from '../Components/HomeComponents/ToysBeauty';
const HomeRootLayout = () => {
  return (
    <div className="container-fluid d-flex flex-column min-vh-100 px-5">
      <CategoryDropdowns />
      <HeroBanner />
      <BestElectronics />
      <ToysBeauty />
    </div>
  );
};

export default HomeRootLayout;
