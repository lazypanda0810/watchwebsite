import WatchIcon from '@mui/icons-material/Watch';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import SportsBikeIcon from '@mui/icons-material/SportsMotorsports';
import LuxuryIcon from '@mui/icons-material/Star';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import FemaleIcon from '@mui/icons-material/Female';
import { Link } from 'react-router-dom';

const catNav = [
    {
        name: "Men's Watches",
        icon: WatchIcon,
        color: "text-blue-600"
    },
    {
        name: "Women's Watches", 
        icon: FemaleIcon,
        color: "text-pink-600"
    },
    {
        name: "Smartwatches",
        icon: WatchLaterIcon,
        color: "text-green-600"
    },
    {
        name: "Luxury Watches",
        icon: LuxuryIcon,
        color: "text-yellow-600"
    },
    {
        name: "Sports Watches",
        icon: SportsBikeIcon,
        color: "text-red-600"
    },
    {
        name: "Kids' Watches",
        icon: ChildCareIcon,
        color: "text-purple-600"
    },
]

const Categories = () => {
    return (
        <section className="hidden sm:block bg-white mt-10 mb-4 min-w-full px-12 py-1 shadow overflow-hidden">

            <div className="flex items-center justify-between mt-4">

                {catNav.map((item, i) => (
                    <Link to={`/products?category=${item.name}`} className="flex flex-col gap-1 items-center p-2 group" key={i}>
                        <div className="h-16 w-16 flex items-center justify-center">
                            <item.icon className={`h-12 w-12 ${item.color} group-hover:scale-110 transition-transform`} />
                        </div>
                        <span className="text-sm text-gray-800 font-medium group-hover:text-gray-900 text-center">{item.name}</span>
                    </Link>
                ))}

            </div>
        </section>
    );
};

export default Categories;
