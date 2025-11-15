import type { Criterion, Item } from '../types';

export const objectiveFountainPenCriteria: Criterion[] = [
	{
		id: 'nib_material',
		name: 'Nib Material',
		description: 'Material composition of the writing nib',
		weight: 0.24,
		defaultScore: 3,
		values: {
			'steel': { value: 'Steel', score: 3 },
			'titanium': { value: 'Titanium', score: 3 },
			'14k_gold': { value: '14k Gold', score: 4 },
			'18k_gold': { value: '18k Gold', score: 4 },
			'21k_gold': { value: '21k Gold', score: 5 },
			'palladium': { value: 'Palladium', score: 4 }
		}
	},
	{
		id: 'body_material',
		name: 'Body Material',
		description: 'Material of the pen barrel',
		weight: 0.1,
		defaultScore: 3,
		values: {
			'plastic': { value: 'Plastic', score: 1 },
			'resin': { value: 'Resin', score: 3 },
			'acrylic': { value: 'Acrylic', score: 3 },
			'ebonite': { value: 'Ebonite', score: 4 },
			'celluloid': { value: 'Celluloid', score: 5 },
			'aluminum': { value: 'Aluminum', score: 3 },
			'titanium': { value: 'Titanium', score: 5 },
			'brass': { value: 'Brass', score: 4 },
			'carbon_fiber': { value: 'Carbon Fiber', score: 4 },
			'ultem': { value: 'Ultem', score: 4 }
		}
	},
	{
		id: 'cap_material',
		name: 'Cap Material',
		description: 'Material of the pen cap (if applicable)',
		weight: 0.06,
		defaultScore: 3,
		values: {
			'plastic': { value: 'Plastic', score: 1 },
			'resin': { value: 'Resin', score: 3 },
			'acrylic': { value: 'Acrylic', score: 3 },
			'ebonite': { value: 'Ebonite', score: 4 },
			'celluloid': { value: 'Celluloid', score: 5 },
			'aluminum': { value: 'Aluminum', score: 3 },
			'titanium': { value: 'Titanium', score: 5 },
			'brass': { value: 'Brass', score: 4 },
			'carbon_fiber': { value: 'Carbon Fiber', score: 4 },
			'ultem': { value: 'Ultem', score: 4 },
			'n/a': { value: 'N/A (Capless)', score: 3 }
		}
	},
	{
		id: 'grip_section_material',
		name: 'Grip Section Material',
		description: 'Material used in the grip section where the pen is held',
		weight: 0.09,
		defaultScore: 3,
		values: {
			'resin': { value: 'Resin', score: 3 },
			'acrylic': { value: 'Acrylic', score: 3 },
			'ebonite': { value: 'Ebonite', score: 5 },
			'metal': { value: 'Metal', score: 2 },
			'plastic': { value: 'Plastic', score: 2 },
			'composite': { value: 'Composite (Fiberglass/Carbon)', score: 4 },
			'wood': { value: 'Wood', score: 4 },
			'rubberized': { value: 'Rubberized/Soft Touch', score: 4 },
			'ultem': { value: 'Ultem', score: 4 }
		}
	},
	{
		id: 'feed_material',
		name: 'Feed Material',
		description: 'Material of the ink feed system',
		weight: 0.08,
		defaultScore: 3,
		values: {
			'plastic': { value: 'Plastic', score: 2 },
			'ebonite': { value: 'Ebonite', score: 4 },
			'titanium': { value: 'Titanium', score: 5 }
		}
	},
	{
		id: 'exterior_decoration',
		name: 'Exterior Decoration',
		description: 'Special decorative treatments or finishes',
		weight: 0.05,
		defaultScore: 3,
		values: {
			'none': { value: 'None', score: 3 },
			'urushi': { value: 'Urushi Lacquer', score: 5 },
			'maki_e': { value: 'Maki-e', score: 5 },
			'engraving': { value: 'Engraving', score: 4 },
			'guilloché': { value: 'Guilloché', score: 4 },
			'demonstrator': { value: 'Demonstrator', score: 3 }
		}
	},
	{
		id: 'scarcity',
		name: 'Scarcity',
		description: 'Production status and availability',
		weight: 0.04,
		defaultScore: 3,
		values: {
			'production': { value: 'In Production', score: 2 },
			'limited_edition': { value: 'Limited Edition', score: 4 },
			'discontinued': { value: 'Discontinued', score: 3 },
			'vintage': { value: 'Vintage', score: 5 }
		}
	},
	{
		id: 'country_origin',
		name: 'Country of Origin',
		description: 'Manufacturing country',
		weight: 0.05,
		defaultScore: 3,
		values: {
			'japan': { value: 'Japan', score: 5 },
			'germany': { value: 'Germany', score: 4 },
			'usa': { value: 'USA', score: 3 },
			'italy': { value: 'Italy', score: 4 },
			'france': { value: 'France', score: 4 },
			'china': { value: 'China', score: 2 },
			'taiwan': { value: 'Taiwan', score: 3 },
			'uk': { value: 'United Kingdom', score: 3 }
		}
	},
	{
		id: 'filling_system',
		name: 'Filling System',
		description: 'Method of ink storage and delivery',
		weight: 0.16,
		defaultScore: 3,
		values: {
			'cartridge_only': { value: 'Cartridge Only', score: 2 },
			'cartridge_converter': { value: 'Cartridge/Converter', score: 3 },
			'piston': { value: 'Piston Filler', score: 5 },
			'vacuum': { value: 'Vacuum Filler', score: 5 },
			'eyedropper': { value: 'Eyedropper', score: 4 },
			'lever': { value: 'Lever Filler', score: 4 },
			'button': { value: 'Button Filler', score: 4 }
		}
	},
	{
		id: 'cap_style',
		name: 'Cap Style',
		description: 'How the cap attaches to the pen',
		weight: 0.025,
		defaultScore: 3,
		values: {
			'snap': { value: 'Snap Cap', score: 3 },
			'screw': { value: 'Screw Cap', score: 3 },
			'magnetic': { value: 'Magnetic Cap', score: 3 },
			'n/a': { value: 'N/A (Capless)', score: 3 }
		}
	},
	{
		id: 'clip_style',
		name: 'Clip Style',
		description: 'Type and design of the pen clip',
		weight: 0.025,
		defaultScore: 3,
		values: {
			'none': { value: 'No Clip', score: 3 },
			'standard': { value: 'Standard Clip', score: 3 },
			'roll_stop': { value: 'Roll Stop', score: 3 },
			'wire': { value: 'Wire Clip', score: 3 }
		}
	},
	{
		id: 'nib_size_range',
		name: 'Nib Size Range',
		description: 'Variety of available nib sizes',
		weight: 0.08,
		defaultScore: 3,
		values: {
			'limited': { value: 'Limited (1-2 sizes)', score: 2 },
			'standard': { value: 'Standard (3-4 sizes)', score: 3 },
			'extensive': { value: 'Extensive (5+ sizes)', score: 4 },
			'specialty': { value: 'Specialty Nibs Available', score: 5 }
		}
	}
];

export const objectiveFountainPens: Item[] = [
	{
		id: 'pilot_custom_74',
		name: 'Pilot Custom 74',
		cost: 160,
		description: 'Classic Japanese fountain pen with gold nib',
		url: 'https://www.pilotpen.com',
		specs: {
			nib_material: '14k_gold',
			body_material: 'resin',
			cap_material: 'resin',
			grip_section_material: 'resin',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'japan',
			filling_system: 'cartridge_converter',
			cap_style: 'snap',
			clip_style: 'standard',
			nib_size_range: 'standard'
		}
	},
	{
		id: 'lamy_2000',
		name: 'Lamy 2000',
		cost: 250,
		description: 'Iconic Bauhaus design with fiberglass body',
		url: 'https://www.lamy.com',
		specs: {
			nib_material: '14k_gold',
			body_material: 'carbon_fiber',
			cap_material: 'carbon_fiber',
			grip_section_material: 'metal',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'germany',
			filling_system: 'piston',
			cap_style: 'snap',
			clip_style: 'roll_stop',
			nib_size_range: 'standard'
		}
	},
	{
		id: 'sailor_pro_gear',
		name: 'Sailor Pro Gear',
		cost: 180,
		description: 'Premium Japanese pen with excellent feedback',
		url: 'https://sailor.co.jp',
		specs: {
			nib_material: '21k_gold',
			body_material: 'resin',
			cap_material: 'resin',
			grip_section_material: 'resin',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'japan',
			filling_system: 'cartridge_converter',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'extensive'
		}
	},
	{
		id: 'twsbi_eco',
		name: 'TWSBI Eco',
		cost: 35,
		description: 'Transparent demonstrator with great ink capacity',
		url: 'https://www.twsbi.com',
		specs: {
			nib_material: 'steel',
			body_material: 'acrylic',
			cap_material: 'acrylic',
			grip_section_material: 'plastic',
			feed_material: 'plastic',
			exterior_decoration: 'demonstrator',
			scarcity: 'production',
			country_origin: 'taiwan',
			filling_system: 'piston',
			cap_style: 'screw',
			clip_style: 'none',
			nib_size_range: 'extensive'
		}
	},
	{
		id: 'montblanc_146',
		name: 'Montblanc Meisterstück 146',
		cost: 650,
		description: 'Luxury German pen with prestigious heritage',
		url: 'https://www.montblanc.com',
		specs: {
			nib_material: '14k_gold',
			body_material: 'resin',
			cap_material: 'resin',
			grip_section_material: 'resin',
			feed_material: 'ebonite',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'germany',
			filling_system: 'piston',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'standard'
		}
	},
	{
		id: 'platinum_3776',
		name: 'Platinum 3776 Century',
		cost: 85,
		description: 'Reliable Japanese pen with slip & seal cap',
		url: 'https://www.platinum-pen.co.jp',
		specs: {
			nib_material: '14k_gold',
			body_material: 'resin',
			cap_material: 'resin',
			grip_section_material: 'resin',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'japan',
			filling_system: 'cartridge_converter',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'extensive'
		}
	},
	{
		id: 'pilot_vanishing_point',
		name: 'Pilot Vanishing Point',
		cost: 140,
		description: 'Retractable fountain pen with click mechanism',
		url: 'https://www.pilotpen.com',
		specs: {
			nib_material: '18k_gold',
			body_material: 'brass',
			cap_material: null,
			grip_section_material: 'metal',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'japan',
			filling_system: 'cartridge_converter',
			cap_style: null,
			clip_style: 'standard',
			nib_size_range: 'standard'
		}
	},
	{
		id: 'pelikan_m800',
		name: 'Pelikan Souverän M800',
		cost: 450,
		description: 'Classic German piston filler with striped body',
		url: 'https://www.pelikan.com',
		specs: {
			nib_material: '18k_gold',
			body_material: 'acrylic',
			cap_material: 'acrylic',
			grip_section_material: 'resin',
			feed_material: 'ebonite',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'germany',
			filling_system: 'piston',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'extensive'
		}
	},
	{
		id: 'conklin_duraflex',
		name: 'Conklin Duraflex',
		cost: 45,
		description: 'Vintage-inspired flex nib pen from USA',
		specs: {
			nib_material: 'steel',
			body_material: 'resin',
			cap_material: 'resin',
			grip_section_material: 'resin',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'usa',
			filling_system: 'cartridge_converter',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'limited'
		}
	},
	{
		id: 'namiki_urushi',
		name: 'Namiki Emperor Urushi',
		cost: 1200,
		description: 'Handcrafted urushi lacquer with maki-e artwork',
		specs: {
			nib_material: '18k_gold',
			body_material: 'ebonite',
			cap_material: 'ebonite',
			grip_section_material: 'ebonite',
			feed_material: 'ebonite',
			exterior_decoration: 'urushi',
			scarcity: 'limited_edition',
			country_origin: 'japan',
			filling_system: 'cartridge_converter',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'standard'
		}
	},
	{
		id: 'parker_51',
		name: 'Parker 51 (Vintage)',
		cost: 180,
		description: 'Classic hooded nib design from the 1940s',
		specs: {
			nib_material: '14k_gold',
			body_material: 'celluloid',
			cap_material: 'celluloid',
			grip_section_material: 'plastic',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'vintage',
			country_origin: 'usa',
			filling_system: 'button',
			cap_style: 'snap',
			clip_style: 'standard',
			nib_size_range: 'limited'
		}
	},
	{
		id: 'kaweco_sport',
		name: 'Kaweco Sport',
		cost: 25,
		description: 'Compact pocket fountain pen from Germany',
		specs: {
			nib_material: 'steel',
			body_material: 'plastic',
			cap_material: 'plastic',
			grip_section_material: 'plastic',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'germany',
			filling_system: 'cartridge_only',
			cap_style: 'screw',
			clip_style: 'none',
			nib_size_range: 'standard'
		}
	},
	{
		id: 'visconti_homo_sapiens',
		name: 'Visconti Homo Sapiens',
		cost: 320,
		description: 'Italian pen made from volcanic lava',
		specs: {
			nib_material: 'palladium',
			body_material: 'carbon_fiber',
			cap_material: 'carbon_fiber',
			grip_section_material: 'composite',
			feed_material: 'ebonite',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'italy',
			filling_system: 'vacuum',
			cap_style: 'magnetic',
			clip_style: 'standard',
			nib_size_range: 'standard'
		}
	},
	{
		id: 'aurora_88',
		name: 'Aurora 88',
		cost: 280,
		description: 'Classic Italian pen with piston filler',
		specs: {
			nib_material: '14k_gold',
			body_material: 'resin',
			cap_material: 'resin',
			grip_section_material: 'resin',
			feed_material: 'ebonite',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'italy',
			filling_system: 'piston',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'extensive'
		}
	},
	{
		id: 'leonardo_momento_zero',
		name: 'Leonardo Momento Zero',
		cost: 165,
		description: 'Modern Italian design with unique resin',
		specs: {
			nib_material: 'steel',
			body_material: 'resin',
			cap_material: 'resin',
			grip_section_material: 'resin',
			feed_material: 'ebonite',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'italy',
			filling_system: 'cartridge_converter',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'extensive'
		}
	},
	{
		id: 'opus_88_koloro',
		name: 'Opus 88 Koloro',
		cost: 75,
		description: 'Taiwanese demonstrator with eyedropper filling',
		specs: {
			nib_material: 'steel',
			body_material: 'acrylic',
			cap_material: 'acrylic',
			grip_section_material: 'ebonite',
			feed_material: 'ebonite',
			exterior_decoration: 'demonstrator',
			scarcity: 'production',
			country_origin: 'taiwan',
			filling_system: 'eyedropper',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'standard'
		}
	},
	{
		id: 'cross_century_ii',
		name: 'Cross Century II',
		cost: 120,
		description: 'American classic with slim profile',
		specs: {
			nib_material: 'steel',
			body_material: 'brass',
			cap_material: 'brass',
			grip_section_material: 'metal',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'usa',
			filling_system: 'cartridge_converter',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'limited'
		}
	},
	{
		id: 'pilot_metropolitan',
		name: 'Pilot Metropolitan',
		cost: 20,
		description: 'Budget-friendly starter pen with excellent value',
		specs: {
			nib_material: 'steel',
			body_material: 'brass',
			cap_material: 'brass',
			grip_section_material: 'metal',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'japan',
			filling_system: 'cartridge_converter',
			cap_style: 'snap',
			clip_style: 'standard',
			nib_size_range: 'limited'
		}
	},
	{
		id: 'franklin_christoph_p66',
		name: 'Franklin-Christoph Model 66',
		cost: 195,
		description: 'American boutique pen with interchangeable nibs',
		specs: {
			nib_material: 'steel',
			body_material: 'acrylic',
			cap_material: 'acrylic',
			grip_section_material: 'acrylic',
			feed_material: 'plastic',
			exterior_decoration: 'none',
			scarcity: 'production',
			country_origin: 'usa',
			filling_system: 'cartridge_converter',
			cap_style: 'screw',
			clip_style: 'standard',
			nib_size_range: 'specialty'
		}
	}
];
