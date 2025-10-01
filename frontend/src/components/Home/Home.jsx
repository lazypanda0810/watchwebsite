import { useEffect } from 'react';
import Categories from '../Layouts/Categories';
import Banner from './Banner/Banner';
import DealSlider from './DealSlider/DealSlider';
import ProductSlider from './ProductSlider/ProductSlider';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getSliderProducts } from '../../actions/productAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';

const Home = () => {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { error, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="WatchHub - Buy Premium Watches Online | Men's, Women's, Smart & Luxury Watches" />
      <Categories />
      <main className="flex flex-col gap-3 px-2 mt-16 sm:mt-2">
        <Banner />
        <DealSlider title={"Watch Deals for You"} />
        {!loading && <ProductSlider title={"Recommended Watches"} tagline={"Based on Your Activity"} />}
        <DealSlider title={"Top Watch Brands, Best Price"} />
        {!loading && <ProductSlider title={"You May Also Like..."} tagline={"Based on Your Interest"} />}
        <DealSlider title={"Premium Watch Collection"} />
        {!loading && <ProductSlider title={"Don't Miss These Timepieces!"} tagline={"Inspired by your browsing"} />}
      </main>
    </>
  );
};

export default Home;
