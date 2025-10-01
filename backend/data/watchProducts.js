const watchProducts = [
  {
    name: "Rolex Submariner Date",
    description: "The Rolex Submariner Date is a luxury diving watch featuring a unidirectional rotating bezel, Oyster case, and Swiss automatic movement. Water-resistant to 300 meters.",
    price: 899999,
    cuttedPrice: 999999,
    category: "Luxury Watches",
    stock: 5,
    warranty: 5,
    ratings: 4.8,
    numOfReviews: 156,
    highlights: [
      "Swiss Made Automatic Movement",
      "300m Water Resistance",
      "Ceramic Bezel",
      "Oyster Steel Case",
      "Glidelock Clasp"
    ],
    specifications: [
      {
        title: "Movement",
        description: "Perpetual, mechanical, self-winding"
      },
      {
        title: "Case",
        description: "Oyster, 41 mm, Oystersteel"
      },
      {
        title: "Water Resistance",
        description: "Waterproof to 300 metres / 1,000 feet"
      },
      {
        title: "Bracelet",
        description: "Oyster, flat three-piece links"
      }
    ],
    movementType: "Automatic",
    dialColor: "Black",
    strapMaterial: "Metal",
    waterResistance: "300m",
    caseSize: "41mm",
    images: [
      {
        public_id: "sample_id_1",
        url: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=500&h=500&fit=crop"
      }
    ],
    brand: {
      name: "Rolex",
      logo: {
        public_id: "rolex_logo",
        url: "https://logos-world.net/wp-content/uploads/2020/09/Rolex-Emblem.png"
      }
    }
  },
  {
    name: "Apple Watch Series 9",
    description: "The most advanced Apple Watch yet with a bright Always-On Retina display, comprehensive health tracking, and seamless iPhone integration.",
    price: 39999,
    cuttedPrice: 45999,
    category: "Smartwatches",
    stock: 25,
    warranty: 2,
    ratings: 4.6,
    numOfReviews: 892,
    highlights: [
      "45mm Always-On Retina Display",
      "Health Monitoring Features",
      "GPS + Cellular",
      "Water Resistant to 50 meters",
      "All-Day Battery Life"
    ],
    specifications: [
      {
        title: "Display",
        description: "Always-On Retina LTPO OLED display"
      },
      {
        title: "Chip",
        description: "S9 SiP with 64-bit dual-core processor"
      },
      {
        title: "Health Features",
        description: "ECG app, Blood oxygen monitoring, Sleep tracking"
      },
      {
        title: "Connectivity",
        description: "GPS + Cellular, Bluetooth 5.3, Wi-Fi"
      }
    ],
    movementType: "Digital",
    dialColor: "Black",
    strapMaterial: "Silicone",
    waterResistance: "50m",
    caseSize: "45mm",
    images: [
      {
        public_id: "sample_id_2",
        url: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=500&h=500&fit=crop"
      }
    ],
    brand: {
      name: "Apple",
      logo: {
        public_id: "apple_logo",
        url: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png"
      }
    }
  },
  {
    name: "Omega Speedmaster Professional",
    description: "The legendary 'Moonwatch' worn by NASA astronauts. Manual-winding chronograph with hesalite crystal and stainless steel case.",
    price: 525000,
    cuttedPrice: 575000,
    category: "Luxury Watches",
    stock: 8,
    warranty: 5,
    ratings: 4.9,
    numOfReviews: 234,
    highlights: [
      "Manual-winding chronograph",
      "Hesalite crystal",
      "Stainless steel case",
      "Tachymeter scale",
      "NASA qualified"
    ],
    specifications: [
      {
        title: "Movement",
        description: "Manual-winding chronograph"
      },
      {
        title: "Case",
        description: "42mm stainless steel"
      },
      {
        title: "Crystal",
        description: "Hesalite crystal"
      },
      {
        title: "Water Resistance",
        description: "50 metres"
      }
    ],
    movementType: "Manual",
    dialColor: "Black",
    strapMaterial: "Metal",
    waterResistance: "50m",
    caseSize: "42mm",
    images: [
      {
        public_id: "sample_id_3",
        url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&h=500&fit=crop"
      }
    ],
    brand: {
      name: "Omega",
      logo: {
        public_id: "omega_logo",
        url: "https://logos-world.net/wp-content/uploads/2020/09/Omega-Logo.png"
      }
    }
  },
  {
    name: "TAG Heuer Formula 1",
    description: "Swiss quartz sports watch inspired by Formula 1 racing. Features steel case, unidirectional rotating bezel, and luminescent hands.",
    price: 125000,
    cuttedPrice: 145000,
    category: "Sports Watches",
    stock: 15,
    warranty: 2,
    ratings: 4.4,
    numOfReviews: 167,
    highlights: [
      "Swiss Quartz Movement",
      "Unidirectional Rotating Bezel",
      "Luminescent Hands and Markers",
      "Stainless Steel Case",
      "Formula 1 Inspired Design"
    ],
    specifications: [
      {
        title: "Movement",
        description: "Swiss quartz"
      },
      {
        title: "Case",
        description: "41mm stainless steel"
      },
      {
        title: "Bezel",
        description: "Unidirectional rotating"
      },
      {
        title: "Water Resistance",
        description: "200 metres"
      }
    ],
    movementType: "Quartz",
    dialColor: "Red",
    strapMaterial: "Metal",
    waterResistance: "200m",
    caseSize: "41mm",
    images: [
      {
        public_id: "sample_id_4",
        url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&h=500&fit=crop"
      }
    ],
    brand: {
      name: "TAG Heuer",
      logo: {
        public_id: "tagheuer_logo",
        url: "https://logos-world.net/wp-content/uploads/2020/09/TAG-Heuer-Logo.png"
      }
    }
  },
  {
    name: "Casio G-Shock GA-2100",
    description: "The modern interpretation of the iconic G-Shock design. Ultra-thin case with carbon core guard structure for ultimate durability.",
    price: 8999,
    cuttedPrice: 11999,
    category: "Sports Watches",
    stock: 50,
    warranty: 2,
    ratings: 4.5,
    numOfReviews: 456,
    highlights: [
      "Carbon Core Guard Structure",
      "Shock Resistant",
      "200M Water Resistance",
      "LED Light",
      "World Time Function"
    ],
    specifications: [
      {
        title: "Movement",
        description: "Digital quartz"
      },
      {
        title: "Case",
        description: "45mm resin with carbon fiber"
      },
      {
        title: "Features",
        description: "Shock resistant, world time, alarm"
      },
      {
        title: "Battery Life",
        description: "Approximately 3 years"
      }
    ],
    movementType: "Digital",
    dialColor: "Black",
    strapMaterial: "Rubber",
    waterResistance: "200m",
    caseSize: "45mm",
    images: [
      {
        public_id: "sample_id_5",
        url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop"
      }
    ],
    brand: {
      name: "Casio",
      logo: {
        public_id: "casio_logo",
        url: "https://logos-world.net/wp-content/uploads/2020/09/Casio-Logo.png"
      }
    }
  },
  {
    name: "Cartier Tank Must",
    description: "Iconic rectangular watch design from Cartier. Features quartz movement, leather strap, and the signature blue sapphire crown.",
    price: 285000,
    cuttedPrice: 325000,
    category: "Women's Watches",
    stock: 12,
    warranty: 3,
    ratings: 4.7,
    numOfReviews: 89,
    highlights: [
      "Iconic Tank Design",
      "Swiss Quartz Movement", 
      "Sapphire Crystal",
      "Blue Sapphire Crown",
      "Genuine Leather Strap"
    ],
    specifications: [
      {
        title: "Movement",
        description: "Swiss quartz"
      },
      {
        title: "Case",
        description: "31mm x 25mm stainless steel"
      },
      {
        title: "Crystal",
        description: "Sapphire crystal"
      },
      {
        title: "Water Resistance",
        description: "30 metres"
      }
    ],
    movementType: "Quartz",
    dialColor: "White",
    strapMaterial: "Leather",
    waterResistance: "30m",
    caseSize: "31mm",
    images: [
      {
        public_id: "sample_id_6",
        url: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=500&h=500&fit=crop"
      }
    ],
    brand: {
      name: "Cartier",
      logo: {
        public_id: "cartier_logo",
        url: "https://logos-world.net/wp-content/uploads/2020/09/Cartier-Logo.png"
      }
    }
  },
  {
    name: "Seiko Prospex Solar Diver",
    description: "Solar-powered diving watch with 200m water resistance. Features unidirectional rotating bezel and luminous hands for underwater visibility.",
    price: 25999,
    cuttedPrice: 29999,
    category: "Sports Watches",
    stock: 30,
    warranty: 3,
    ratings: 4.3,
    numOfReviews: 278,
    highlights: [
      "Solar Movement",
      "200M Water Resistance",
      "Unidirectional Rotating Bezel",
      "Luminous Hands and Markers",
      "Stainless Steel Case"
    ],
    specifications: [
      {
        title: "Movement",
        description: "Solar quartz"
      },
      {
        title: "Case",
        description: "42mm stainless steel"
      },
      {
        title: "Power Reserve",
        description: "10 months when fully charged"
      },
      {
        title: "Features",
        description: "Rotating bezel, date display"
      }
    ],
    movementType: "Quartz",
    dialColor: "Blue",
    strapMaterial: "Rubber",
    waterResistance: "200m",
    caseSize: "42mm",
    images: [
      {
        public_id: "sample_id_7",
        url: "https://images.unsplash.com/photo-1511370235399-1802cae1d32f?w=500&h=500&fit=crop"
      }
    ],
    brand: {
      name: "Seiko",
      logo: {
        public_id: "seiko_logo",
        url: "https://logos-world.net/wp-content/uploads/2020/09/Seiko-Logo.png"
      }
    }
  },
  {
    name: "Fossil Gen 6 Smartwatch",
    description: "Wear OS by Google smartwatch with heart rate & activity tracker, GPS, NFC payments, and smartphone notifications.",
    price: 24999,
    cuttedPrice: 29999,
    category: "Smartwatches",
    stock: 35,
    warranty: 2,
    ratings: 4.2,
    numOfReviews: 334,
    highlights: [
      "Wear OS by Google",
      "Heart Rate & Activity Tracker",
      "GPS Built-in",
      "NFC Payments",
      "Customizable Watch Faces"
    ],
    specifications: [
      {
        title: "Operating System",
        description: "Wear OS by Google"
      },
      {
        title: "Display",
        description: "1.28\" AMOLED touchscreen"
      },
      {
        title: "Connectivity",
        description: "Bluetooth, Wi-Fi, GPS"
      },
      {
        title: "Battery Life",
        description: "24+ hours with smart battery modes"
      }
    ],
    movementType: "Digital",
    dialColor: "Black",
    strapMaterial: "Silicone",
    waterResistance: "30m",
    caseSize: "44mm",
    images: [
      {
        public_id: "sample_id_8",
        url: "https://images.unsplash.com/photo-1517502474097-f9b30659dadb?w=500&h=500&fit=crop"
      }
    ],
    brand: {
      name: "Fossil",
      logo: {
        public_id: "fossil_logo",
        url: "https://logos-world.net/wp-content/uploads/2020/09/Fossil-Logo.png"
      }
    }
  },
  {
    name: "Disney Kids Mickey Mouse Watch",
    description: "Fun and colorful Mickey Mouse themed watch for kids. Features easy-to-read numbers and durable construction for active children.",
    price: 2499,
    cuttedPrice: 3499,
    category: "Kids' Watches",
    stock: 40,
    warranty: 1,
    ratings: 4.4,
    numOfReviews: 125,
    highlights: [
      "Mickey Mouse Design",
      "Easy-to-Read Numbers",
      "Durable Construction",
      "Adjustable Strap",
      "Water Resistant"
    ],
    specifications: [
      {
        title: "Movement",
        description: "Quartz"
      },
      {
        title: "Case",
        description: "32mm plastic"
      },
      {
        title: "Strap",
        description: "Adjustable fabric strap"
      },
      {
        title: "Age Range",
        description: "3-10 years"
      }
    ],
    movementType: "Quartz",
    dialColor: "Red",
    strapMaterial: "Fabric",
    waterResistance: "30m",
    caseSize: "32mm",
    images: [
      {
        public_id: "sample_id_9",
        url: "https://images.unsplash.com/photo-1596438459862-22d4b6de4c96?w=500&h=500&fit=crop"
      }
    ],
    brand: {
      name: "Disney",
      logo: {
        public_id: "disney_logo",
        url: "https://logos-world.net/wp-content/uploads/2020/09/Disney-Logo.png"
      }
    }
  },
  {
    name: "Tissot PRC 200 Chronograph",
    description: "Swiss-made sports chronograph with 200m water resistance. Features stainless steel case, sapphire crystal, and precision timing functions.",
    price: 35999,
    cuttedPrice: 42999,
    category: "Men's Watches",
    stock: 20,
    warranty: 2,
    ratings: 4.6,
    numOfReviews: 189,
    highlights: [
      "Swiss Quartz Chronograph",
      "200M Water Resistance",
      "Sapphire Crystal",
      "Stainless Steel Construction",
      "Precision Timing Functions"
    ],
    specifications: [
      {
        title: "Movement",
        description: "Swiss quartz chronograph"
      },
      {
        title: "Case",
        description: "42mm stainless steel"
      },
      {
        title: "Crystal",
        description: "Sapphire crystal with anti-reflective coating"
      },
      {
        title: "Functions",
        description: "Chronograph, date, tachymeter"
      }
    ],
    movementType: "Quartz",
    dialColor: "Black",
    strapMaterial: "Metal",
    waterResistance: "200m",
    caseSize: "42mm",
    images: [
      {
        public_id: "sample_id_10",
        url: "https://images.unsplash.com/photo-1533167649158-6d508895b680?w=500&h=500&fit=crop"
      }
    ],
    brand: {
      name: "Tissot",
      logo: {
        public_id: "tissot_logo",
        url: "https://logos-world.net/wp-content/uploads/2020/09/Tissot-Logo.png"
      }
    }
  }
];

module.exports = watchProducts;