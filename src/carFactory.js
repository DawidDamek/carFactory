class CarFactory {
  static supportedBrands = ['Fiat', 'Lancia', 'Ford', 'Subaru'];

  _isArray(brand) {
    return Boolean(Array.isArray(brand));
  }

  _isNotSupported(brand) {
    return !CarFactory.supportedBrands.includes(brand);
  }

  capitalizeBrandsFunction(brand) {
    if (this._isArray(brand)) {
      return brand
        .flat()
        .map((brand) => brand.slice(0, 1).toUpperCase() + brand.slice(1));
    }
    return brand.slice(0, 1).toUpperCase() + brand.slice(1);
  }

  constructor(factory, brand) {
    const capitalizedBrand = this.capitalizeBrandsFunction(brand);

    if (this._isArray(capitalizedBrand)) {
      const unsupportedBrands = capitalizedBrand.filter((brand) => {
        return this._isNotSupported(brand);
      });

      if (unsupportedBrands.length) {
        const unsupportedBrandsStr = unsupportedBrands.join(', ');
        throw new UnsupportedBrandError(
          `Brand not supported: '${unsupportedBrandsStr}'`
        );
      }

      this.factoryName = `${factory} produces: ${capitalizedBrand.join(', ')}`;
      this.brand = capitalizedBrand;
      return;
    }
    if (this._isNotSupported(capitalizedBrand)) {
      throw new UnsupportedBrandError(
        `Brand not supported: '${capitalizedBrand}'`
      );
    }
    this.factoryName = `${factory} produces: ${capitalizedBrand}`;
    this.brand = capitalizedBrand;
  }

  createCar(carBrand = this.brand) {
    const capitalizedCarBrand = this.capitalizeBrandsFunction(carBrand);

    if (this.brand.includes(capitalizedCarBrand) && !this._isArray(carBrand)) {
      return { brand: capitalizedCarBrand };
    }
    throw new UnsupportedBrandError(
      'Factory does not have a brand or do not support it'
    );
  }

  createCars(...params) {
    const carsArray = [];

    if (typeof params[0] === 'number') {
      if (this._isArray(this.brand)) {
        for (let i = 0; i < params; i++) {
          for (let brand of this.brand) {
            let car = this.createCar(brand);
            carsArray.push(car);
          }
        }
        return carsArray;
      }
      for (let i = 0; i < params; i++) {
        let car = this.createCar(this.brand);
        carsArray.push(car);
      }
      return carsArray;
    }

    const supportedBrands = params.filter((param) =>
      this.brand.includes(this.capitalizeBrandsFunction(param[1]))
    );
    for (let carArr of supportedBrands) {
      let carsNumber = carArr.shift();
      let carsBrand = carArr.pop();
      for (let i = 0; i < carsNumber; i++) {
        let car = this.createCar(carsBrand);
        carsArray.push(car);
      }
    }
    debugger;
    return carsArray;
  }
}

class UnsupportedBrandError extends Error {}

module.exports = { CarFactory, UnsupportedBrandError };
