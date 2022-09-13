const UnsupportedBrandError = require('./carFactory').UnsupportedBrandError
describe('CarFactory', () => {
	let CarFactory;
	
	beforeEach(() => {
		jest.isolateModules(() => {
			CarFactory = require('./carFactory').CarFactory
		})
	})
	
	describe('new', () => {
		test('creates instance of Car', () => {
			expect(new CarFactory('Fiat Bielsko', ['fiat']).constructor.name).toBe('CarFactory');
		});

		test('does allow creation of factory for supported brands only (Fiat, Lancia, Ford, Subaru)', () => {
			expect(() => new CarFactory('Fiat Bielsko', ['deawoo', ['bmw']])).toThrow(new UnsupportedBrandError("Brand not supported: 'Deawoo, Bmw'"))
		});
	})

	describe('createCar', () => {
		describe('factory is created for one brand only',  () => {
			test('creates an instance of car for factory default brand', () => {
				const factory = new CarFactory('Fiat Bielsko', 'fiat')

				const car = factory.createCar()

				expect(car.brand).toBe('Fiat')
			});

			test('creates an instance of car for factory which brand provided as a parameter', () => {
				const factory = new CarFactory('Fiat Bielsko', 'fiat')

				const car = factory.createCar('fiat')

				expect(car.brand).toBe('Fiat')
			});
		})

		describe('factory is created for many brands only',  () => {
			test('does not allow creating car with default brand', () => {
				const factory = new CarFactory('Fiat Bielsko', ['fiat', 'lancia'])

				expect(() => factory.createCar()).toThrow(new UnsupportedBrandError("Factory does not have a brand or do not support it"))
			});

			test('creates an instance of car for factory which brand provided as a parameter', () => {
				const factory = new CarFactory('Fiat Bielsko', ['fiat', 'lancia'])

				const car = factory.createCar('fiat')

				expect(car.brand).toBe('Fiat')
			});

			test('does allow creation of an instance of car for factory given brand only', () => {
				const factory = new CarFactory('Fiat Bielsko', ['fiat', 'lancia'])

				expect(() => factory.createCar('subaru')).toThrow(new UnsupportedBrandError("Factory does not have a brand or do not support it"))
			});
		})
	})

	describe('createCars', () => {
		describe('when called with number',  () => {
			test('creates a given number of car instances for factory default brand', () => {
				const factory = new CarFactory('Fiat Bielsko', 'fiat')

				const [car1, car2] = factory.createCars(2)

				expect(car1.brand).toBe('Fiat')
				expect(car2.brand).toBe('Fiat')
			});

			test('loops through all available brands', () => {
				const factory = new CarFactory('Fiat Bielsko', ['fiat', 'lancia'])

				const [car1, car2, car3] = factory.createCars(3)

				expect(car1.brand).toBe('Fiat')
				expect(car2.brand).toBe('Lancia')
				expect(car3.brand).toBe('Fiat')
			});
		})

		describe('when called with configuration array',  () => {
			test('allows creating a given amount of car for specified brands', () => {
				const factory = new CarFactory('Fiat Bielsko', ['fiat', 'lancia'])

				const [car1, car2, car3] = factory.createCars([2, 'fiat'], [1, 'lancia'])

				 expect(car1.brand).toBe('Fiat')
				 expect(car2.brand).toBe('Fiat')
				 expect(car3.brand).toBe('Lancia')
			});

			test('disregards non existing brands', () => {
				let cars = []
				const factory = new CarFactory('Fiat Bielsko', ['fiat', 'lancia'])

				expect(() => cars = factory.createCars([2, 'fiat'], [1, 'lancia'], [3, 'syrena'])).not.toThrow(new UnsupportedBrandError("Factory does not have a brand or do not support it"))

				const [car1, car2, car3] = cars

				expect(car1.brand).toBe('Fiat')
				expect(car2.brand).toBe('Fiat')
				expect(car3.brand).toBe('Lancia')
			});
		})
	})
		
	describe('factoryName', () => {
		describe('when one brand is provided', () => {
			test('returns factory name with supported brand', () => {
				expect(new CarFactory('Fiat Bielsko', 'fiat').factoryName).toBe('Fiat Bielsko produces: Fiat');
			});
		})

		describe('when many brands are provided', () => {
			test('returns factory name with supported brand', () => {
				expect(new CarFactory('Fiat Bielsko', ['fiat', 'subaru']).factoryName).toBe('Fiat Bielsko produces: Fiat, Subaru');
			});
		})
	})
})
