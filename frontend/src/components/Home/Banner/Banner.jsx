import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Banner.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const PreviousBtn = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <ArrowBackIosIcon />
    </div>
  )
}

export const NextBtn = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <ArrowForwardIosIcon />
    </div>
  )
}

const Banner = () => {

  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
  };

  // Watch-themed banner images from Unsplash
  const banners = [
    'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=1200&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1200&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=1200&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=1200&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&h=400&fit=crop&q=80'
  ];

  return (
    <>
      <section className="h-44 sm:h-72 w-full rounded-sm shadow relative overflow-hidden">
        <Slider {...settings}>
          {banners.map((el, i) => (
            <img draggable="false" className="h-44 sm:h-72 w-full object-cover" src={el} alt="banner" key={i} />
          ))}
        </Slider>
      </section>
    </>
  );
};

export default Banner;
