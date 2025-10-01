import { useEffect, useState } from 'react';
import WorkIcon from '@mui/icons-material/Work';
import StarsIcon from '@mui/icons-material/Stars';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HelpIcon from '@mui/icons-material/Help';
import paymentMethods from '../../../assets/images/payment-methods.svg';
import { useLocation } from 'react-router-dom';

const footerLinks = [
  {
    title: "about",
    links: [
      {
        name: "Contact Us",
        redirect: "#",
      },
      {
        name: "About WatchHub",
        redirect: "#",
      },
      {
        name: "Careers",
        redirect: "#",
      },
      {
        name: "WatchHub Stories",
        redirect: "#",
      },
      {
        name: "Press",
        redirect: "#",
      },
      {
        name: "WatchHub Wholesale",
        redirect: "#",
      },
      {
        name: "Corporate Information",
        redirect: "#",
      },
    ]
  },
  {
    title: "help",
    links: [
      {
        name: "Payments",
        redirect: "#",
      },
      {
        name: "Shipping",
        redirect: "#",
      },
      {
        name: "Cancellation & Returns",
        redirect: "#",
      },
      {
        name: "FAQ",
        redirect: "#",
      }
    ]
  },
  {
    title: "policy",
    links: [
      {
        name: "Return Policy",
        redirect: "#",
      },
      {
        name: "Terms Of Use",
        redirect: "#",
      },
      {
        name: "Security",
        redirect: "#",
      },
      {
        name: "Privacy",
        redirect: "#",
      },
      {
        name: "Sitemap",
        redirect: "#",
      },
      {
        name: "Watch Care Guide",
        redirect: "#",
      },
    ]
  },
  {
    title: "social",
    links: [
      {
        name: "Facebook",
        redirect: "https://www.facebook.com/watchhub",
      },
      {
        name: "Twitter",
        redirect: "https://twitter.com/watchhub",
      },
      {
        name: "YouTube",
        redirect: "https://www.youtube.com/watchhub",
      }
    ]
  }
]

const Footer = () => {

  const location = useLocation();
  const [adminRoute, setAdminRoute] = useState(false);

  useEffect(() => {
    setAdminRoute(location.pathname.split("/", 2).includes("admin"))
  }, [location]);

  return (
    <>
      {!adminRoute && (
        <>
          <footer className="mt-20 w-full py-1 sm:py-4 px-4 sm:px-12 bg-gray-900 text-white text-xs border-b border-gray-600 flex flex-col sm:flex-row overflow-hidden">
            <div className="w-full sm:w-7/12 flex flex-col sm:flex-row">

              {footerLinks.map((el, i) => (
                <div className="w-full sm:w-1/5 flex flex-col gap-2 my-3 sm:my-6 ml-5" key={i}>
                  <h2 className="text-gray-400 mb-2 uppercase">{el.title}</h2>
                  {el.links.map((item, i) => (
                    <a href={item.redirect} target="_blank" rel="noreferrer" className="hover:underline hover:text-amber-400 transition-colors" key={i}>{item.name}</a>
                  ))}

                </div>
              ))}

            </div>

            <div className="border-gray-600 h-36 w-1 border-l mr-5 mt-6 hidden sm:block"></div>
            <div className="w-full sm:w-5/12 my-6 mx-5 sm:mx-0 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
              <div className="w-full sm:w-1/2">
                <h2 className="text-gray-400">Mail Us:</h2>
                <p className="mt-2 leading-5">WatchHub Private Limited,<br />
                  Premium Watch Plaza,<br />
                  Timepiece Avenue,<br />
                  Luxury District, Watch City,<br />
                  Mumbai, 400001,<br />
                  Maharashtra, India
                </p>
              </div>

              <div className="w-full sm:w-1/2">
                <h2 className="text-gray-400">Registered Office Address:</h2>
                <p className="mt-2 leading-5">WatchHub Private Limited,<br />
                  Premium Watch Plaza,<br />
                  Timepiece Avenue,<br />
                  Luxury District, Watch City,<br />
                  Mumbai, 400001,<br />
                  Maharashtra, India <br />
                  CIN : U51109MH2025PTC066107<br />
                  Telephone: <a className="text-amber-400 hover:text-amber-300" href="tel:18002029898">1800 202 9898</a>
                </p>
              </div>
            </div>

          </footer>
          {/* <!-- footer ends --> */}

          <div className="px-16 py-6 w-full bg-gray-900 hidden sm:flex justify-between items-center text-sm text-white">
            <a href="#" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
              <span className="text-amber-400"><WorkIcon sx={{ fontSize: "20px" }} /></span> Sell Watches on WatchHub
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
              <span className="text-amber-400"><StarsIcon sx={{ fontSize: "20px" }} /></span> Advertise
            </a>
            <a href="#" rel="noreferrer" target="_blank" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
              <span className="text-amber-400"><CardGiftcardIcon sx={{ fontSize: "20px" }} /></span> Gift Cards
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
              <span className="text-amber-400"><HelpIcon sx={{ fontSize: "20px" }} /></span> Help Center
            </a>

            <span>&copy; 2025 WatchHub.com</span>
            <img draggable="false" src={paymentMethods} alt="Card Payment" />
          </div>
        </>
      )}
    </>
  )
};

export default Footer;
