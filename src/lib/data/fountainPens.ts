import type { Criterion, Item } from '../types';

export const fountainPenCriteria: Criterion[] = [
	{
		id: 'build_quality',
		name: 'Build Quality & Materials',
		description: 'Overall construction quality, durability, and materials used',
		weight: 0.15
	},
	{
		id: 'nib_performance',
		name: 'Nib Performance',
		description: 'Quality, smoothness, consistency, and characteristics of the writing nib',
		weight: 0.25
	},
	{
		id: 'ink_flow',
		name: 'Ink Flow & Feed System',
		description: 'How well the pen delivers ink from reservoir to paper',
		weight: 0.20
	},
	{
		id: 'comfort_ergonomics',
		name: 'Writing Comfort & Ergonomics',
		description: 'Comfort during extended writing sessions and ergonomic design',
		weight: 0.15
	},
	{
		id: 'filling_system',
		name: 'Filling System & Capacity',
		description: 'How the pen is filled with ink and storage capacity',
		weight: 0.10
	},
	{
		id: 'aesthetics',
		name: 'Aesthetics & Design',
		description: 'Visual appeal, design elements, and overall appearance',
		weight: 0.10
	},
	{
		id: 'value',
		name: 'Value for Money',
		description: 'Quality and features relative to price point',
		weight: 0.15
	},
	{
		id: 'maintenance',
		name: 'Maintenance & Reliability',
		description: 'Ease of maintenance and long-term reliability',
		weight: 0.08
	},
	{
		id: 'portability',
		name: 'Portability & Practical Use',
		description: 'Suitability for everyday carry and practical use',
		weight: 0.07
	},
	{
		id: 'specialty_features',
		name: 'Specialty Features',
		description: 'Unique characteristics that set the pen apart',
		weight: 0.05
	}
];

export const fountainPens: Item[] = [
	{
		id: 'pilot_custom_74',
		name: 'Pilot Custom 74',
		cost: 160,
		description: 'Classic Japanese fountain pen with gold nib',
		url: 'https://www.pilotpen.com',
		scores: {
			build_quality: 8.5,
			nib_performance: 9.0,
			ink_flow: 8.5,
			comfort_ergonomics: 8.0,
			filling_system: 7.0,
			aesthetics: 7.5,
			value: 8.0,
			maintenance: 8.5,
			portability: 8.0,
			specialty_features: 6.0
		},
		attributes: {
			body_material: 'resin',
			cap_material: 'resin',
			body_finial: 'rounded',
			cap_finial: 'rounded',
			nib_material: '14k gold',
			cap_type: 'snap',
			clip_type: 'clip',
			filling_mechanism: 'cartridge/converter',
			country: 'Japan',
			nib_sizes: ['EF', 'F', 'M', 'B']
		}
	},
	{
		id: 'lamy_2000',
		name: 'Lamy 2000',
		cost: 250,
		description: 'Iconic Bauhaus design with fiberglass body',
		url: 'https://www.lamy.com',
		scores: {
			build_quality: 9.0,
			nib_performance: 8.0,
			ink_flow: 8.5,
			comfort_ergonomics: 8.0,
			filling_system: 9.0,
			aesthetics: 9.0,
			value: 7.5,
			maintenance: 8.0,
			portability: 8.5,
			specialty_features: 7.0
		},
		attributes: {
			body_material: 'fiberglass',
			cap_material: 'fiberglass',
			body_finial: 'flat',
			cap_finial: 'flat',
			nib_material: '14k gold',
			cap_type: 'snap',
			clip_type: 'roll-stop',
			filling_mechanism: 'piston',
			country: 'Germany',
			nib_sizes: ['EF', 'F', 'M', 'B']
		}
	},
	{
		id: 'sailor_pro_gear',
		name: 'Sailor Pro Gear',
		cost: 180,
		description: 'Premium Japanese pen with excellent feedback',
		url: 'https://sailor.co.jp',
		scores: {
			build_quality: 8.5,
			nib_performance: 9.5,
			ink_flow: 9.0,
			comfort_ergonomics: 8.5,
			filling_system: 6.5,
			aesthetics: 8.0,
			value: 8.0,
			maintenance: 8.5,
			portability: 7.5,
			specialty_features: 8.5
		},
		attributes: {
			body_material: 'resin',
			cap_material: 'resin',
			body_finial: 'flat',
			cap_finial: 'flat',
			nib_material: '14k gold',
			cap_type: 'snap',
			clip_type: 'clip',
			filling_mechanism: 'cartridge/converter',
			country: 'Japan',
			nib_sizes: ['EF', 'F', 'MF', 'M', 'B']
		}
	},
	{
		id: 'twsbi_eco',
		name: 'TWSBI Eco',
		cost: 35,
		description: 'Transparent demonstrator with great ink capacity',
		url: 'https://www.twsbi.com',
		scores: {
			build_quality: 7.0,
			nib_performance: 6.5,
			ink_flow: 7.5,
			comfort_ergonomics: 7.5,
			filling_system: 9.0,
			aesthetics: 7.0,
			value: 9.5,
			maintenance: 8.0,
			portability: 8.5,
			specialty_features: 5.0
		},
		attributes: {
			body_material: 'acrylic',
			cap_material: 'acrylic',
			body_finial: 'rounded',
			cap_finial: 'rounded',
			nib_material: 'steel',
			cap_type: 'threaded',
			clip_type: 'clipless',
			filling_mechanism: 'piston',
			country: 'Taiwan',
			nib_sizes: ['EF', 'F', 'M', 'B', '1.1mm']
		}
	},
	{
		id: 'montblanc_146',
		name: 'Montblanc Meisterstück 146',
		cost: 650,
		description: 'Luxury German pen with prestigious heritage',
		url: 'https://www.montblanc.com',
		scores: {
			build_quality: 9.5,
			nib_performance: 9.0,
			ink_flow: 8.5,
			comfort_ergonomics: 8.5,
			filling_system: 8.0,
			aesthetics: 9.5,
			value: 6.0,
			maintenance: 7.5,
			portability: 8.0,
			specialty_features: 9.0
		},
		attributes: {
			body_material: 'resin',
			cap_material: 'resin',
			body_finial: 'rounded',
			cap_finial: 'star',
			nib_material: '14k gold',
			cap_type: 'threaded',
			clip_type: 'clip',
			filling_mechanism: 'piston',
			country: 'Germany',
			nib_sizes: ['EF', 'F', 'M', 'B']
		}
	},
	{
		id: 'platinum_3776',
		name: 'Platinum 3776 Century',
		cost: 85,
		description: 'Reliable Japanese pen with slip & seal cap',
		url: 'https://www.platinum-pen.co.jp',
		scores: {
			build_quality: 8.0,
			nib_performance: 7.5,
			ink_flow: 8.0,
			comfort_ergonomics: 8.5,
			filling_system: 7.0,
			aesthetics: 7.0,
			value: 9.0,
			maintenance: 9.0,
			portability: 8.5,
			specialty_features: 7.5
		},
		attributes: {
			body_material: 'resin',
			cap_material: 'resin',
			body_finial: 'rounded',
			cap_finial: 'rounded',
			nib_material: '14k gold',
			cap_type: 'threaded',
			clip_type: 'clip',
			filling_mechanism: 'cartridge/converter',
			country: 'Japan',
			nib_sizes: ['UEF', 'EF', 'F', 'M', 'B']
		}
	}
];