import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WatchIcon from '@mui/icons-material/Watch';
import Searchbar from './Searchbar';
import PrimaryDropDownMenu from './PrimaryDropDownMenu';
import SecondaryDropDownMenu from './SecondaryDropDownMenu';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const { cartItems } = useSelector(state => state.cart);

  const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);
  const [toggleSecondaryDropDown, setToggleSecondaryDropDown] = useState(false);

  return (

    <header className="bg-gray-900 fixed top-0 py-2.5 w-full z-10 shadow-lg">

      {/* <!-- navbar container --> */}
      <div className="w-full sm:w-9/12 px-1 sm:px-4 m-auto flex justify-between items-center relative">

        {/* <!-- logo & search container --> */}
        <div className="flex items-center flex-1">
          <Link className="flex items-center mr-1 sm:mr-4" to="/">
            <WatchIcon className="h-8 w-8 text-amber-400 mr-2" />
            <span className="text-white text-xl font-bold hidden sm:block">WatchHub</span>
          </Link>

          <Searchbar />
        </div>
        {/* <!-- logo & search container --> */}

        {/* <!-- right navs --> */}
        <div className="flex items-center justify-between ml-1 sm:ml-0 gap-0.5 sm:gap-7 relative">

          {isAuthenticated === false ?
            <Link to="/login" className="px-3 sm:px-9 py-0.5 text-gray-900 bg-white border font-medium rounded-sm cursor-pointer hover:bg-gray-100 transition-colors">Login</Link>
            :
            (
              <span className="userDropDown flex items-center text-white font-medium gap-1 cursor-pointer hover:text-amber-400 transition-colors" onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}>{user.name && user.name.split(" ", 1)}
                <span>{togglePrimaryDropDown ? <ExpandLessIcon sx={{ fontSize: "16px" }} /> : <ExpandMoreIcon sx={{ fontSize: "16px" }} />}</span>
              </span>
            )
          }

          {togglePrimaryDropDown && <PrimaryDropDownMenu setTogglePrimaryDropDown={setTogglePrimaryDropDown} user={user} />}

          <span className="moreDropDown hidden sm:flex items-center text-white font-medium gap-1 cursor-pointer hover:text-amber-400 transition-colors" onClick={() => setToggleSecondaryDropDown(!toggleSecondaryDropDown)}>More
            <span>{toggleSecondaryDropDown ? <ExpandLessIcon sx={{ fontSize: "16px" }} /> : <ExpandMoreIcon sx={{ fontSize: "16px" }} />}</span>
          </span>

          {toggleSecondaryDropDown && <SecondaryDropDownMenu />}

          <Link to="/cart" className="flex items-center text-white font-medium gap-2 relative hover:text-amber-400 transition-colors">
            <span><ShoppingCartIcon /></span>
            {cartItems.length > 0 &&
              <div className="w-5 h-5 p-2 bg-red-500 text-xs rounded-full absolute -top-2 left-3 flex justify-center items-center border">
                {cartItems.length}
              </div>
            }
            Cart
          </Link>
        </div>
        {/* <!-- right navs --> */}

      </div>
      {/* <!-- navbar container --> */}
    </header>
  )
};

export default Header;
